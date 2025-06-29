import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../pages/HistoryPage/Modal';
import { describe, test, expect, vi } from 'vitest';

describe('Modal component', () => {
  const mockData = [
    { data: 100, naming: 'Item 1' },
    { data: 200, naming: 'Item 2' }
  ];

  test('не отображается при isOpen=false', () => {
    render(
      <Modal
        isOpen={false}
        onClose={() => {}}
        dataArray={mockData}
      />
    );
    
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  test('отображается при isOpen=true', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        dataArray={mockData}
      />
    );
    
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  test('отображает переданные данные', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        dataArray={mockData}
      />
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  test('закрывается при клике на кнопку закрытия', () => {
    const onClose = vi.fn();
    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        dataArray={mockData}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  test('закрывается при клике вне модального окна', () => {
    const onClose = vi.fn();
    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        dataArray={mockData}
      />
    );
    
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalled();
  });

  test('не закрывается при клике внутри модального окна', () => {
    const onClose = vi.fn();
    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        dataArray={mockData}
      />
    );
    
    fireEvent.click(screen.getByTestId('modal-content'));
    expect(onClose).not.toHaveBeenCalled();
  });
});