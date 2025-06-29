import { uploadFile } from '../api/fileUploader';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import 'whatwg-fetch';

// Мокируем колбэк-функции
const mockOnDataReceived = vi.fn();
const mockOnComplete = vi.fn();
const mockOnError = vi.fn();

// Создаем мок-файл
const createMockFile = () => new File(['name,age\nJohn,30\nJane,25'], 'test.csv', { 
  type: 'text/csv' 
});

describe('uploadFile API function', () => {
  // Создаем mock server
  const server = setupServer();
  
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  afterAll(() => server.close());

  test('успешно обрабатывает потоковые данные', async () => {
    server.use(
      http.post('http://localhost:3000/aggregate', () => {
        // Создаем поток данных
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('{"name": "John", "age": 30}\n'));
            controller.enqueue(new TextEncoder().encode('{"name": "Jane", "age": 25}\n'));
            controller.close();
          }
        });
        
        return new HttpResponse(stream, {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );

    await uploadFile(
      createMockFile(),
      mockOnDataReceived,
      mockOnComplete,
      mockOnError
    );

    expect(mockOnDataReceived).toHaveBeenCalledTimes(2);
    expect(mockOnDataReceived).toHaveBeenCalledWith({ name: "John", age: 30 });
    expect(mockOnDataReceived).toHaveBeenCalledWith({ name: "Jane", age: 25 });
    expect(mockOnComplete).toHaveBeenCalled();
    expect(mockOnError).not.toHaveBeenCalled();
  });

  test('обрабатывает частичные JSON объекты', async () => {
    server.use(
      http.post('http://localhost:3000/aggregate', () => {
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('{"name": "John",'));
            controller.enqueue(new TextEncoder().encode('"age": 30}\n'));
            controller.enqueue(new TextEncoder().encode('{"name": "Jane", "age":'));
            controller.enqueue(new TextEncoder().encode('25}\n'));
            controller.close();
          }
        });
        
        return new HttpResponse(stream, {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );

    await uploadFile(
      createMockFile(),
      mockOnDataReceived,
      mockOnComplete,
      mockOnError
    );

    expect(mockOnDataReceived).toHaveBeenCalledTimes(2);
    expect(mockOnDataReceived).toHaveBeenCalledWith({ name: "John", age: 30 });
    expect(mockOnDataReceived).toHaveBeenCalledWith({ name: "Jane", age: 25 });
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('вызывает onError при сетевой ошибке', async () => {
    server.use(
      http.post('http://localhost:3000/aggregate', () => {
        return HttpResponse.error();
      })
    );

    await uploadFile(
      createMockFile(),
      mockOnDataReceived,
      mockOnComplete,
      mockOnError
    );

    expect(mockOnError).toHaveBeenCalled();
    expect(mockOnError.mock.calls[0][0].message).toContain('Failed to fetch');
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('вызывает onError при 500 ошибке сервера', async () => {
    server.use(
      http.post('http://localhost:3000/aggregate', () => {
        return new HttpResponse(
          JSON.stringify({ error: 'Internal server error' }), 
          { status: 500 }
        );
      })
    );

    await uploadFile(
      createMockFile(),
      mockOnDataReceived,
      mockOnComplete,
      mockOnError
    );

    expect(mockOnError).toHaveBeenCalled();
    expect(mockOnError.mock.calls[0][0].message).toContain('HTTP error! status: 500');
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test('корректно обрабатывает пустой ответ', async () => {
    server.use(
      http.post('http://localhost:3000/aggregate', () => {
        return new HttpResponse(null, {
          status: 204, // No Content
        });
      })
    );

    await uploadFile(
      createMockFile(),
      mockOnDataReceived,
      mockOnComplete,
      mockOnError
    );

    expect(mockOnDataReceived).not.toHaveBeenCalled();
    expect(mockOnComplete).toHaveBeenCalled();
    expect(mockOnError).not.toHaveBeenCalled();
  });


});