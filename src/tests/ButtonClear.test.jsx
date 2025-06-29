import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonClear } from '../pages/HistoryPage/ButtonClear';
import { describe, test, expect, vi } from 'vitest';

// Мокаем localStorage
const localStorageMock = {
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ButtonClear', () => {
  test('отображает кнопку "Очистить всё"', () => {
    const setNotes = vi.fn();
    render(<ButtonClear setNotes={setNotes} />);
    expect(screen.getByText('Очистить всё')).toBeInTheDocument();
  });

  test('очищает записи и localStorage при клике', () => {
    const setNotes = vi.fn();
    render(<ButtonClear setNotes={setNotes} />);
    
    fireEvent.click(screen.getByText('Очистить всё'));
    
    expect(setNotes).toHaveBeenCalledWith([]);
    expect(localStorageMock.clear).toHaveBeenCalled();
  });
});