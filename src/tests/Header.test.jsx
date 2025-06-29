// import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../components/Header'; 
import styles from '../components/Header.module.css'; // Импорт стилей
import { describe, expect, test } from 'vitest';

describe('Header Component Navigation', () => {
  const renderWithRouter = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Header />
      </MemoryRouter>
    );
  };

  test('отображает все навигационные ссылки', () => {
    renderWithRouter();
    
    expect(screen.getByText('CSV Аналитик')).toBeInTheDocument();
    expect(screen.getByText('CSV Генератор')).toBeInTheDocument();
    expect(screen.getByText('История')).toBeInTheDocument();
  });

  test('активная ссылка "CSV Аналитик" при переходе на главную страницу', () => {
    renderWithRouter('/');
    
    const analyticsLink = screen.getByText('CSV Аналитик');
    expect(analyticsLink).toHaveClass(styles.active);
    
    expect(screen.getByText('CSV Генератор')).not.toHaveClass(styles.active);
    expect(screen.getByText('История')).not.toHaveClass(styles.active);
  });

  test('активная ссылка "CSV Генератор" при переходе на /generator', () => {
    renderWithRouter('/generator');
    
    const generatorLink = screen.getByText('CSV Генератор');
    expect(generatorLink).toHaveClass(styles.active);
    
    expect(screen.getByText('CSV Аналитик')).not.toHaveClass(styles.active);
    expect(screen.getByText('История')).not.toHaveClass(styles.active);
  });

  test('активная ссылка "История" при переходе на /history', () => {
    renderWithRouter('/history');
    
    const historyLink = screen.getByText('История');
    expect(historyLink).toHaveClass(styles.active);
    
    expect(screen.getByText('CSV Аналитик')).not.toHaveClass(styles.active);
    expect(screen.getByText('CSV Генератор')).not.toHaveClass(styles.active);
  });

  test('ссылки имеют правильные атрибуты href', () => {
    renderWithRouter();
    
    expect(screen.getByText('CSV Аналитик').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('CSV Генератор').closest('a')).toHaveAttribute('href', '/generator');
    expect(screen.getByText('История').closest('a')).toHaveAttribute('href', '/history');
  });
});