import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import GlobalPage from '@/app/(frontend)/statistics/global/page';

// Mock de los hooks personalizados
vi.mock('@/app/(frontend)/statistics/global/hooks/useGlobal', () => ({
  useGlobal: vi.fn(),
}));

vi.mock('@/app/(frontend)/statistics/global/context/useGlobalContext', () => ({
  useGlobalContext: vi.fn(),
}));

// Mock de LoadingPage y UpdatingPage
vi.mock('@/app/(frontend)/loaders/LoadingPage', () => ({
  LoadingPage: function LoadingPage() {
    return React.createElement('div', { 'data-testid': 'loading-page' }, 'Loading...');
  },
}));

vi.mock('@/app/(frontend)/statistics/components/UpdatingPage/UpdatingPage', () => ({
  UpdatingPage: function UpdatingPage() {
    return React.createElement('div', { 'data-testid': 'updating-page' }, 'Updating...');
  },
}));

// Mock de Next.js Link
vi.mock('next/dist/client/link', () => ({
  default: function Link({ children, href }: any) {
    return React.createElement('a', { href }, children);
  },
}));

// Mock de react-markdown
vi.mock('react-markdown', () => ({
  default: function Markdown({ children }: any) {
    return React.createElement('div', {}, children);
  },
}));

// Mock de los componentes de gráficas y tablas
vi.mock('@/app/(frontend)/statistics/global/components', () => ({
  CommonNameBySchool: function CommonNameBySchool() {
    return React.createElement(
      'div',
      { 'data-testid': 'common-name-by-school' },
      'CommonNameBySchool'
    );
  },
  LongestNames: function LongestNames() {
    return React.createElement('div', { 'data-testid': 'longest-names' }, 'LongestNames');
  },
  MostConstantsSchools: function MostConstantsSchools() {
    return React.createElement(
      'div',
      { 'data-testid': 'most-constants-schools' },
      'MostConstantsSchools'
    );
  },
  NamesSurnamesDiversity: function NamesSurnamesDiversity() {
    return React.createElement(
      'div',
      { 'data-testid': 'names-surnames-diversity' },
      'NamesSurnamesDiversity'
    );
  },
  SchoolsEvolution: function SchoolsEvolution() {
    return React.createElement('div', { 'data-testid': 'schools-evolution' }, 'SchoolsEvolution');
  },
  TopNames: function TopNames() {
    return React.createElement('div', { 'data-testid': 'top-names' }, 'TopNames');
  },
  TopSchools: function TopSchools() {
    return React.createElement('div', { 'data-testid': 'top-schools' }, 'TopSchools');
  },
  TopSurnames: function TopSurnames() {
    return React.createElement('div', { 'data-testid': 'top-surnames' }, 'TopSurnames');
  },
  TotalParticipants: function TotalParticipants() {
    return React.createElement('div', { 'data-testid': 'total-participants' }, 'TotalParticipants');
  },
}));

describe('GlobalPage', () => {
  const mockGlobalStats = {
    intro: [
      {
        category: 'intro',
        public_data: {},
        summary: 'Introducción a las estadísticas globales',
      },
    ],
    outro: [
      {
        category: 'outro',
        public_data: {},
        summary: 'Conclusión de las estadísticas globales',
      },
    ],
    topNames: [
      {
        category: 'topNames',
        public_data: [
          { name: 'Juan', count: 150 },
          { name: 'María', count: 140 },
        ],
        summary: 'Top nombres',
      },
    ],
    topSurnames: [
      {
        category: 'topSurnames',
        public_data: [
          { surname: 'García', count: 100 },
          { surname: 'Martínez', count: 95 },
        ],
        summary: 'Top apellidos',
      },
    ],
    namesDiversity: [
      {
        category: 'namesDiversity',
        public_data: 500,
        summary: 'Diversidad de nombres',
      },
    ],
    surnamesDiversity: [
      {
        category: 'surnamesDiversity',
        public_data: 300,
        summary: 'Diversidad de apellidos',
      },
    ],
    longestNames: [
      {
        category: 'longestNames',
        public_data: ['María del Carmen', 'José Antonio'],
        summary: 'Nombres más largos',
      },
    ],
    topSchools: [
      {
        category: 'topSchools',
        public_data: [
          { school: 'Colegio A', count: 200 },
          { school: 'Colegio B', count: 180 },
        ],
        summary: 'Top colegios',
      },
    ],
    mostConstantSchools: [
      {
        category: 'mostConstantSchools',
        public_data: [
          {
            school: 'Colegio A',
            yearsActive: [
              { year: 2022, count: 50 },
              { year: 2023, count: 55 },
            ],
          },
        ],
        summary: 'Colegios más constantes',
      },
    ],
    schoolsEvolution: [
      {
        category: 'schoolsEvolution',
        public_data: [
          {
            school: 'Colegio A',
            total: 100,
            years: [
              { year: 2022, count: 50 },
              { year: 2023, count: 50 },
            ],
          },
        ],
        summary: 'Evolución de colegios',
      },
    ],
    commonNameBySchool: [
      {
        category: 'commonNameBySchool',
        public_data: [{ name: 'Juan', school: 'Colegio A' }],
        summary: 'Nombre más común por colegio',
      },
    ],
    totalParticipants: [
      {
        category: 'totalParticipants',
        public_data: [
          { year: 2022, count: 1000 },
          { year: 2023, count: 1100 },
        ],
        summary: 'Total de participantes',
      },
    ],
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Importar los mocks dinámicamente
    const { useGlobal } = await import('@/app/(frontend)/statistics/global/hooks/useGlobal');
    const { useGlobalContext } = await import(
      '@/app/(frontend)/statistics/global/context/useGlobalContext'
    );

    // Mock por defecto: datos cargados
    vi.mocked(useGlobalContext).mockReturnValue({
      statistics: mockGlobalStats,
      setStatistics: vi.fn(),
    });

    vi.mocked(useGlobal).mockReturnValue({
      isLoading: false,
      isUpdating: false,
    });

    // Mock de la fecha por defecto (fuera del período crítico)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Renderizado de componentes', () => {
    it('debería renderizar todos los componentes principales cuando hay datos', () => {
      // Act
      render(<GlobalPage />);

      // Assert
      expect(screen.getByTestId('top-names')).toBeInTheDocument();
      expect(screen.getByTestId('top-surnames')).toBeInTheDocument();
      expect(screen.getByTestId('names-surnames-diversity')).toBeInTheDocument();
      expect(screen.getByTestId('longest-names')).toBeInTheDocument();
      expect(screen.getByTestId('top-schools')).toBeInTheDocument();
      expect(screen.getByTestId('most-constants-schools')).toBeInTheDocument();
      expect(screen.getByTestId('schools-evolution')).toBeInTheDocument();
      expect(screen.getByTestId('common-name-by-school')).toBeInTheDocument();
      expect(screen.getByTestId('total-participants')).toBeInTheDocument();
    });

    it('debería renderizar el título de la página', () => {
      // Act
      render(<GlobalPage />);

      // Assert
      expect(screen.getByText('Tamborrada Infantil — Estadísticas Globales')).toBeInTheDocument();
    });

    it('debería renderizar el texto de intro y outro', () => {
      // Act
      render(<GlobalPage />);

      // Assert
      expect(screen.getByText('Introducción a las estadísticas globales')).toBeInTheDocument();
      expect(screen.getByText('Conclusión de las estadísticas globales')).toBeInTheDocument();
    });

    it('debería renderizar el enlace de información', () => {
      // Act
      render(<GlobalPage />);

      // Assert
      const infoLink = screen.getByRole('link');
      expect(infoLink).toHaveAttribute('href', './info');
    });
  });

  describe('Comportamiento de carga', () => {
    it('debería mostrar LoadingPage cuando isLoading es true', async () => {
      // Arrange
      const { useGlobal } = await import('@/app/(frontend)/statistics/global/hooks/useGlobal');
      vi.mocked(useGlobal).mockReturnValue({
        isLoading: true,
        isUpdating: false,
      });

      // Act
      render(<GlobalPage />);

      // Assert
      expect(screen.getByTestId('loading-page')).toBeInTheDocument();
      expect(screen.queryByTestId('top-names')).not.toBeInTheDocument();
    });

    it('debería mostrar LoadingPage si statistics es null', async () => {
      // Arrange
      const { useGlobalContext } = await import(
        '@/app/(frontend)/statistics/global/context/useGlobalContext'
      );
      vi.mocked(useGlobalContext).mockReturnValue({
        statistics: null,
        setStatistics: vi.fn(),
      });

      // Act
      render(<GlobalPage />);

      // Assert
      expect(screen.getByTestId('loading-page')).toBeInTheDocument();
      expect(screen.queryByTestId('top-names')).not.toBeInTheDocument();
    });

    it('debería mostrar UpdatingPage cuando isUpdating es true', async () => {
      // Arrange
      const { useGlobal } = await import('@/app/(frontend)/statistics/global/hooks/useGlobal');
      vi.mocked(useGlobal).mockReturnValue({
        isLoading: false,
        isUpdating: true,
      });

      // Act
      render(<GlobalPage />);

      // Assert
      expect(screen.getByTestId('updating-page')).toBeInTheDocument();
      expect(screen.queryByTestId('top-names')).not.toBeInTheDocument();
    });
  });
});
