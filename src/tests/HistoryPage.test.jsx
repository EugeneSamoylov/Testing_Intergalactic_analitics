import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HistoryPage } from "../pages/HistoryPage/HistoryPage";
import { describe, test, expect, vi, beforeEach } from "vitest";

// Выносим store во внешнюю область видимости
let store = {};

// Мокируем localStorage
const localStorageMock = {
  getItem: vi.fn((key) => store[key]),
  setItem: vi.fn((key, value) => {
    store[key] = value;
  }),
  clear: vi.fn(() => {
    store = {};
  }),
  removeItem: vi.fn((key) => {
    delete store[key];
  }),
};

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Мокируем компонент ButtonGenerateMore
vi.mock("../pages/HistoryPage/ButtonGenerateMore.jsx", () => ({
  ButtonGenerateMore: () => <button>Сгенерировать больше</button>,
}));

// Мокируем компонент ButtonClear
vi.mock("../pages/HistoryPage/ButtonClear.jsx", () => ({
  ButtonClear: ({ setNotes }) => (
    <button onClick={() => setNotes([])}>Очистить всё</button>
  ),
}));

describe("HistoryPage component", () => {
  const mockNotes = [
    {
      id: 1,
      filename: "file1.csv",
      date: "2023-10-10",
      data: [{}, {}], // Успешно обработан
    },
    {
      id: 2,
      filename: "file2.csv",
      date: "2023-10-11",
      data: [], // Ошибка обработки
    },
  ];

  beforeEach(() => {
    // Сбрасываем store перед каждым тестом
    store = {};

    // Очищаем моки
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.clear.mockClear();
    localStorageMock.removeItem.mockClear();

    // Устанавливаем начальные данные
    localStorageMock.setItem("analyticsHistory", JSON.stringify(mockNotes));
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "analyticsHistory") return JSON.stringify(mockNotes);
      return null;
    });
  });

  // Вспомогательная функция для рендеринга
  const renderHistoryPage = () => {
    return render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );
  };

  test("отображает список записей истории", () => {
    renderHistoryPage();

    // Проверяем, что файлы отображаются
    expect(screen.getByText("file1.csv")).toBeInTheDocument();
    expect(screen.getByText("file2.csv")).toBeInTheDocument();

    // Проверяем кнопки
    expect(screen.getByText("Сгенерировать больше")).toBeInTheDocument();
    expect(screen.getByText("Очистить всё")).toBeInTheDocument();
  });

  test("при пустой истории не отображается список и кнопка очистки", () => {
    // Устанавливаем пустую историю
    localStorageMock.getItem.mockImplementation(() => "[]");
    store["analyticsHistory"] = "[]";

    renderHistoryPage();

    // Проверяем, что записи не отображаются
    expect(screen.queryByText("file1.csv")).not.toBeInTheDocument();
    expect(screen.queryByText("file2.csv")).not.toBeInTheDocument();

    // Кнопка "Очистить всё" не должна отображаться
    expect(screen.queryByText("Очистить всё")).not.toBeInTheDocument();

    // Кнопка "Сгенерировать больше" должна оставаться
    expect(screen.getByText("Сгенерировать больше")).toBeInTheDocument();
  });

  test("удаляет запись при нажатии на иконку корзины", () => {
    renderHistoryPage();

    const deleteButtons = screen.getAllByRole("button", { name: /Удалить/i });
    expect(deleteButtons).toHaveLength(2);

    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText("file1.csv")).not.toBeInTheDocument();
    expect(screen.getByText("file2.csv")).toBeInTheDocument();

    expect(localStorageMock.setItem).toHaveBeenCalled();

    // ВАЖНО: Получаем последний вызов setItem
    const lastCallIndex = localStorageMock.setItem.mock.calls.length - 1;
    const [key, value] = localStorageMock.setItem.mock.calls[lastCallIndex];

    expect(key).toBe("analyticsHistory");
    const updatedNotes = JSON.parse(value);
    expect(updatedNotes).toHaveLength(1);
    expect(updatedNotes[0].id).toBe(2);
  });
});
