// import { describe, expect, test, vi } from "vitest";
// import { generateCSV } from "../api/csvGenerator";

// global.fetch = vi.fn();

// describe("Загрузка файла из генератора", () => {
//   afterEach(() => {
//     vi.clearAllMocks();
//   });

//   test("если сервер не запущен, то выдаст ошибку", async () => {
//     fetch.mockRejectedValue(new Error("Сервер не запущен"));

//     // 2. Ожидаем, что вызов функции завершится ошибкой
//     await expect(generateCSV()).rejects.toThrow("Сервер не запущен");

//     // 3. Проверяем, что fetch был вызван
//     expect(fetch).toHaveBeenCalledTimes(1);

//     // const testData = undefined;

//     // const result = generateCSV();

//     // expect(result).toBe(new Error(errorData.message || "Ошибка генерации отчета"));
//   });
// });
import { afterEach, describe, expect, test, vi } from "vitest";
import { generateCSV } from "../api/csvGenerator";

// Мокаем глобальный fetch
global.fetch = vi.fn();

describe("Загрузка файла из генератора", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("если сервер не запущен, то выдаст ошибку", async () => {
    // 1. Симулируем ошибку сети при вызове fetch
    fetch.mockRejectedValue(new Error("Сервер не запущен"));

    // 2. Ожидаем, что вызов функции завершится ошибкой
    await expect(generateCSV()).rejects.toThrow("Сервер не запущен");

    // 3. Проверяем, что fetch был вызван
    expect(fetch).toHaveBeenCalledTimes(1);
  });


  test("если сервер запущен и отвечает корректно, возвращает response", async () => {
    // 1. Создаем мок успешного ответа
    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers({ "Content-Type": "text/csv" }),
      text: vi.fn().mockResolvedValue("csv,data\n1,example")
    };
    
    // 2. Мокаем fetch для возврата успешного ответа
    fetch.mockResolvedValue(mockResponse);

    // 3. Вызываем функцию с тестовыми параметрами
    const result = await generateCSV(0.5, "on", "500");

    // 4. Проверяем результат
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    
    // 5. Проверяем параметры вызова fetch
    const expectedUrl = new URL("http://localhost:3000/report");
    expectedUrl.searchParams.append("size", "0.5");
    expectedUrl.searchParams.append("withErrors", "on");
    expectedUrl.searchParams.append("maxSpend", "500");
    
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      method: "GET",
      headers: {
        Accept: "text/csv",
      },
    });
  });
});