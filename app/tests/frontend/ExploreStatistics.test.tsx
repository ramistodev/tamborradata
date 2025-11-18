import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ExploreStatistics } from '@/app/(frontend)/components/ExploreStatistics/ExploreStatistics';

// Mock del hook personalizado
vi.mock('@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics', () => ({
  useExploreStatistics: vi.fn(),
}));

// Mock de Next.js Link
vi.mock('next/link', () => ({
  default: function Link({ children, href }: any) {
    return React.createElement('a', { href, 'data-testid': 'link' }, children);
  },
}));

// Mock de framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: function MotionDiv({ children, ref, ...props }: any) {
      return React.createElement('div', { ref, ...props }, children);
    },
    article: function MotionArticle({ children, ref, ...props }: any) {
      return React.createElement('article', { ref, ...props }, children);
    },
  },
  AnimatePresence: function AnimatePresence({ children }: any) {
    return React.createElement('div', {}, children);
  },
  useInView: vi.fn(() => true),
}));

describe('ExploreStatistics', () => {
  const mockDefaultValues = {
    lastStatYear: { current: 2024 },
    currentYear: 2025,
    newData: false,
    comingData: false,
    years: 7,
    isNotificationsInView: true,
    isHeaderInView: true,
    isGlobalCardInView: true,
    isYearlyCardInView: true,
    isStatsInView: true,
    notificationsRef: { current: null },
    headerRef: { current: null },
    globalCardRef: { current: null },
    yearlyCardRef: { current: null },
    statsRef: { current: null },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const { useExploreStatistics } = await import(
      '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
    );

    // Mock por defecto: estado normal sin notificaciones
    vi.mocked(useExploreStatistics).mockReturnValue(mockDefaultValues);
  });

  describe('Renderizado básico', () => {
    it('debería renderizarse sin errores', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('Explora las estadísticas')).toBeInTheDocument();
    });

    it('debería mostrar el título principal', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('Explora las estadísticas')).toBeInTheDocument();
      expect(
        screen.getByText(/Descubre la evolución de la Tamborrada Infantil/i)
      ).toBeInTheDocument();
    });

    it('debería mostrar la tarjeta de estadísticas globales', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('Estadísticas globales')).toBeInTheDocument();
      expect(
        screen.getByText(/Un vistazo general a todos los años de la Tamborrada Infantil/i)
      ).toBeInTheDocument();
    });

    it('debería mostrar la tarjeta de últimas estadísticas', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText(/Últimas estadísticas \(2024\)/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Mira los datos más recientes: colegios, nombres y apellidos/i)
      ).toBeInTheDocument();
    });

    it('debería mostrar las 4 tarjetas de estadísticas numéricas', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('2018')).toBeInTheDocument();
      expect(screen.getByText('Desde')).toBeInTheDocument();
      expect(screen.getByText('7+')).toBeInTheDocument();
      expect(screen.getByText('Años de datos')).toBeInTheDocument();
      expect(screen.getByText('30k+')).toBeInTheDocument();
      expect(screen.getByText('Participantes')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('Automatizado')).toBeInTheDocument();
    });
  });

  describe('Enlaces y navegación', () => {
    it('debería generar correctamente la URL de estadísticas globales', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      const links = screen.getAllByTestId('link');
      const globalLink = links.find((link) => link.getAttribute('href') === '/statistics/global');
      expect(globalLink).toBeDefined();
    });

    it('debería generar correctamente la URL con el año dinámico', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      const links = screen.getAllByTestId('link');
      const yearLink = links.find((link) => link.getAttribute('href') === '/statistics/2024');
      expect(yearLink).toBeDefined();
    });

    it('debería usar el año actual - 1 como fallback si lastStatYear no está disponible', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        lastStatYear: { current: null as any },
        currentYear: 2025,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      const links = screen.getAllByTestId('link');
      const yearLink = links.find((link) => link.getAttribute('href') === '/statistics/2024');
      expect(yearLink).toBeDefined();
    });
  });

  describe('Notificaciones de nuevos datos', () => {
    it('NO debería mostrar notificaciones cuando newData y comingData son false', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.queryByText(/Explora los nuevos datos de/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Proximamente/i)).not.toBeInTheDocument();
    });

    it('debería mostrar notificación de nuevos datos cuando newData es true', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        newData: true,
        lastStatYear: { current: 2024 },
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText(/Explora los nuevos datos de 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Actualizado recientemente/i)).toBeInTheDocument();
    });

    it('debería mostrar notificación de datos próximos cuando comingData es true', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        comingData: true,
        currentYear: 2025,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert - Buscar específicamente el texto con "Disponible" que solo está en la notificación
      expect(screen.getByText(/Disponible el 20 de enero/i)).toBeInTheDocument();
      const notifications = screen.getAllByText(/Proximamente 2025/i);
      expect(notifications.length).toBeGreaterThan(0);
    });

    it('debería mostrar badge "NUEVO!" en la tarjeta cuando hay nuevos datos', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        newData: true,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('NUEVO!')).toBeInTheDocument();
    });

    it('debería mostrar badge "Proximamente" en la tarjeta cuando comingData es true', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        comingData: true,
        currentYear: 2025,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText(/Proximamente 2025!/i)).toBeInTheDocument();
    });
  });

  describe('Años de datos dinámicos', () => {
    it('debería mostrar correctamente el número de años calculado', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        years: 5,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('5+')).toBeInTheDocument();
    });

    it('debería mostrar correctamente diferentes valores de años', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        years: 10,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('10+')).toBeInTheDocument();
    });
  });

  describe('Textos de llamada a la acción', () => {
    it('debería mostrar el botón de ver estadísticas globales', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('Ver estadísticas globales')).toBeInTheDocument();
    });

    it('debería mostrar el botón con el año correcto para las últimas estadísticas', () => {
      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText(/Ver datos de 2024/i)).toBeInTheDocument();
    });
  });

  describe('Manejo de estados edge cases', () => {
    it('debería manejar correctamente cuando lastStatYear es el año actual', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        lastStatYear: { current: 2025 },
        currentYear: 2025,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText(/Últimas estadísticas \(2025\)/i)).toBeInTheDocument();
      const links = screen.getAllByTestId('link');
      const yearLink = links.find((link) => link.getAttribute('href') === '/statistics/2025');
      expect(yearLink).toBeDefined();
    });

    it('debería renderizarse correctamente con years = 0', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        years: 0,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('0+')).toBeInTheDocument();
      expect(screen.getByText('Explora las estadísticas')).toBeInTheDocument();
    });

    it('debería manejar correctamente valores negativos de years', async () => {
      // Arrange
      const { useExploreStatistics } = await import(
        '@/app/(frontend)/components/ExploreStatistics/hooks/useExploreStatistics'
      );
      vi.mocked(useExploreStatistics).mockReturnValue({
        ...mockDefaultValues,
        years: -1,
      });

      // Act
      render(<ExploreStatistics />);

      // Assert
      expect(screen.getByText('-1+')).toBeInTheDocument();
    });
  });

  describe('Refs de animación', () => {
    it('debería pasar todas las refs necesarias para las animaciones', () => {
      // Act
      const { container } = render(<ExploreStatistics />);

      // Assert - Verificar que el componente se renderiza completamente
      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });
});
