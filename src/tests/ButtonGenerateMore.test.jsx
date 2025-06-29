import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonGenerateMore } from '../pages/HistoryPage/ButtonGenerateMore';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';

// Мокаем весь модуль react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Теперь импортируем useNavigate из мокового модуля
import { useNavigate } from 'react-router-dom';

describe('ButtonGenerateMore', () => {
  test('отображает кнопку "Сгенерировать больше"', () => {
    render(
      <MemoryRouter>
        <ButtonGenerateMore />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Сгенерировать больше')).toBeInTheDocument();
  });

  test('переходит на страницу генератора при клике', () => {
    // Создаем мок-функцию для навигации
    const navigateMock = vi.fn();
    
    // Устанавливаем, что useNavigate вернет нашу мок-функцию
    useNavigate.mockImplementation(() => navigateMock);
    
    render(
      <MemoryRouter>
        <ButtonGenerateMore />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Сгенерировать больше'));
    expect(navigateMock).toHaveBeenCalledWith('/generator');
    
    // Очищаем моки после теста
    vi.restoreAllMocks();
  });
});