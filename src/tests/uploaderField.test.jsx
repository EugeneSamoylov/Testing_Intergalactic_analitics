import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UploaderField } from '../pages/AnalyticsPage/UploaderField';
import { describe, test, expect, vi, afterEach } from 'vitest';

// Мокируем функцию валидации
vi.mock('../../validation/isFileValid.js', () => ({
  isFileValid: vi.fn().mockImplementation(file => file.name.toLowerCase().endsWith('.csv'))
}));

describe('UploaderField component', () => {
  // Вспомогательные функции
  const createCSVFile = (name) => new File(['content'], name, { type: 'text/csv' });
  const createInvalidFile = (name) => new File(['content'], name, { type: 'image/png' });

  // Пропсы для компонента
  const mockProps = {
    onFileSelect: vi.fn(),
    onDragStateChange: vi.fn(),
    state: 'idle',
    fileName: '',
    setFileName: vi.fn()
  };

  // Очищаем моки после каждого теста
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('принимает валидный CSV файл через кнопку', async () => {
    render(<UploaderField {...mockProps} />);
    const file = createCSVFile('valid.csv');
    
    // Находим кнопку загрузки
    const uploadButton = screen.getByText('Загрузить файл');
    
    // Эмулируем клик по кнопке
    await userEvent.click(uploadButton);
    
    // Получаем скрытый input
    const fileInput = uploadButton.parentElement.querySelector('input[type="file"]');
    
    // Эмулируем загрузку файла
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Ждем обработки
    await waitFor(() => {
      expect(mockProps.onFileSelect).toHaveBeenCalledWith(file, true);
      expect(mockProps.setFileName).toHaveBeenCalledWith('valid.csv');
    });
  });

  test('отклоняет невалидный файл при загрузке через кнопку', async () => {
    render(<UploaderField {...mockProps} />);
    const file = createInvalidFile('invalid.png');
    const uploadButton = screen.getByText('Загрузить файл');
    
    // Эмулируем клик по кнопке
    await userEvent.click(uploadButton);
    
    // Получаем скрытый input
    const fileInput = uploadButton.parentElement.querySelector('input[type="file"]');
    
    // Эмулируем загрузку файла
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Ждем обработки
    await waitFor(() => {
      expect(mockProps.onFileSelect).toHaveBeenCalledWith(file, false);
      expect(mockProps.setFileName).toHaveBeenCalledWith('invalid.png');
    });
  });

  test('принимает валидный CSV файл через drag&drop', () => {
    render(<UploaderField {...mockProps} />);
    const file = createCSVFile('drag-valid.csv');
    const dropZone = screen.getByText('или перетащите сюда').closest('div');
    
    // Эмулируем события перетаскивания
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    expect(mockProps.onFileSelect).toHaveBeenCalledWith(file, true);
    expect(mockProps.setFileName).toHaveBeenCalledWith('drag-valid.csv');
  });

  test('отклоняет невалидный файл при drag&drop', () => {
    render(<UploaderField {...mockProps} />);
    const file = createInvalidFile('drag-invalid.png');
    const dropZone = screen.getByText('или перетащите сюда').closest('div');
    
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    expect(mockProps.onFileSelect).toHaveBeenCalledWith(file, false);
    expect(mockProps.setFileName).toHaveBeenCalledWith('drag-invalid.png');
  });

  test('меняет стили при перетаскивании файла', () => {
    render(<UploaderField {...mockProps} />);
    const dropZone = screen.getByText('или перетащите сюда').closest('div');
    
    // Эмулируем перетаскивание
    fireEvent.dragOver(dropZone);
    
    expect(mockProps.onDragStateChange).toHaveBeenCalledWith('dragging');
    
    // Эмулируем уход файла
    fireEvent.dragLeave(dropZone);
    
    expect(mockProps.onDragStateChange).toHaveBeenCalledWith('idle');
  });

  test('сбрасывает состояние при нажатии на кнопку закрытия', () => {
    render(<UploaderField {...mockProps} state="success" fileName="test.csv" />);
    
    // Используем aria-label для поиска кнопки
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);
    
    expect(mockProps.onDragStateChange).toHaveBeenCalledWith('idle');
  });

  test('отображает спиннер при состоянии "parsing"', () => {
    render(<UploaderField {...mockProps} state="parsing" />);
    
    // Проверяем по роли
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Проверяем текст
    expect(screen.getByText('идет парсинг файла')).toBeInTheDocument();
  });
});