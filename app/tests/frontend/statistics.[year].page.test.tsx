import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import YearPage from '@/app/(frontend)/statistics/[year]/page';

// Mock de los hooks personalizados
vi.mock('@/app/(frontend)/statistics/[year]/hooks/useYear', () => ({
  useYear: vi.fn(),
}));

vi.mock('@/app/(frontend)/statistics/[year]/context/useYearContext', () => ({
  useYearContext: vi.fn(),
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

// Mock de Next.js navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  useParams: vi.fn(() => ({ year: '2023' })),
}));

// Mock de Next.js Link
vi.mock('next/link', () => ({
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
vi.mock('@/app/(frontend)/statistics/[year]/components', () => ({
  CommonNamesBySchool: function CommonNamesBySchool() {
    return React.createElement(
      'div',
      { 'data-testid': 'common-names-by-school' },
      'CommonNamesBySchool'
    );
  },
  NamesSurnamesDiversity: function NamesSurnamesDiversity() {
    return React.createElement(
      'div',
      { 'data-testid': 'names-surnames-diversity' },
      'NamesSurnamesDiversity'
    );
  },
  NewNames: function NewNames() {
    return React.createElement('div', { 'data-testid': 'new-names' }, 'NewNames');
  },
  NewSchools: function NewSchools() {
    return React.createElement('div', { 'data-testid': 'new-schools' }, 'NewSchools');
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

describe('YearPage', () => {
  const mockYearStats = {
    intro: [
      {
        category: 'intro',
        public_data: {},
        summary: 'Introducción a las estadísticas de 2023',
      },
    ],
    outro: [
      {
        category: 'outro',
        public_data: {},
        summary: 'Conclusión de las estadísticas de 2023',
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
    newNames: [
      {
        category: 'newNames',
        public_data: ['Carlos', 'Laura'],
        summary: 'Nombres nuevos',
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
    newSchools: [
      {
        category: 'newSchools',
        public_data: ['Colegio Nuevo'],
        summary: 'Colegios nuevos',
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
        public_data: [{ year: 2023, count: 1000 }],
        summary: 'Total de participantes',
      },
    ],
    topNamesByYear: [],
    commonNameBySchoolByYear: [],
    topSchoolsByYear: [],
    topSurnamesByYear: [],
    newNamesByYear: [],
    newSchoolsByYear: [],
    namesDiversityByYear: [],
    surnamesDiversityByYear: [],
    totalParticipantsByYear: [],
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Importar los mocks dinámicamente
    const { useYear } = await import('@/app/(frontend)/statistics/[year]/hooks/useYear');
    const { useYearContext } = await import(
      '@/app/(frontend)/statistics/[year]/context/useYearContext'
    );

    // Mock por defecto: datos cargados para el año 2023
    vi.mocked(useYearContext).mockReturnValue({
      statistics: mockYearStats,
      setStatistics: vi.fn(),
      year: '2023',
    });

    vi.mocked(useYear).mockReturnValue({
      year: '2023',
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
    it('debería renderizar todos los componentes principales cuando hay datos', async () => {
      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2023' }) }));

      // Assert
      expect(screen.getByTestId('top-names')).toBeInTheDocument();
      expect(screen.getByTestId('top-surnames')).toBeInTheDocument();
      expect(screen.getByTestId('new-names')).toBeInTheDocument();
      expect(screen.getByTestId('names-surnames-diversity')).toBeInTheDocument();
      expect(screen.getByTestId('top-schools')).toBeInTheDocument();
      expect(screen.getByTestId('new-schools')).toBeInTheDocument();
      expect(screen.getByTestId('common-names-by-school')).toBeInTheDocument();
      expect(screen.getByTestId('total-participants')).toBeInTheDocument();
    });

    it('debería renderizar el título de la página con el año', async () => {
      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2023' }) }));

      // Assert
      expect(screen.getByText('Tamborrada Infantil 2023')).toBeInTheDocument();
    });

    it('debería renderizar el texto de intro y outro', async () => {
      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2023' }) }));

      // Assert
      expect(screen.getByText('Introducción a las estadísticas de 2023')).toBeInTheDocument();
      expect(screen.getByText('Conclusión de las estadísticas de 2023')).toBeInTheDocument();
    });

    it('debería renderizar el enlace de información', async () => {
      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2023' }) }));

      // Assert
      const infoLink = screen.getByRole('link');
      expect(infoLink).toHaveAttribute('href', './info');
    });
  });

  describe('Comportamiento de carga', () => {
    it('debería mostrar LoadingPage cuando isLoading es true', async () => {
      // Arrange
      const { useYear } = await import('@/app/(frontend)/statistics/[year]/hooks/useYear');
      vi.mocked(useYear).mockReturnValue({
        year: '2023',
        isLoading: true,
        isUpdating: false,
      });

      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2023' }) }));

      // Assert
      expect(screen.getByTestId('loading-page')).toBeInTheDocument();
      expect(screen.queryByTestId('top-names')).not.toBeInTheDocument();
    });

    it('debería mostrar LoadingPage si statistics es null y está cargando', async () => {
      // Arrange
      const { useYearContext } = await import(
        '@/app/(frontend)/statistics/[year]/context/useYearContext'
      );
      const { useYear } = await import('@/app/(frontend)/statistics/[year]/hooks/useYear');

      vi.mocked(useYearContext).mockReturnValue({
        statistics: null,
        setStatistics: vi.fn(),
        year: '2023',
      });

      vi.mocked(useYear).mockReturnValue({
        year: '2023',
        isLoading: true,
        isUpdating: false,
      });

      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2023' }) }));

      // Assert
      expect(screen.getByTestId('loading-page')).toBeInTheDocument();
      expect(screen.queryByTestId('top-names')).not.toBeInTheDocument();
    });

    it('debería mostrar UpdatingPage cuando isUpdating es true', async () => {
      // Arrange
      const { useYear } = await import('@/app/(frontend)/statistics/[year]/hooks/useYear');
      vi.mocked(useYear).mockReturnValue({
        year: '2023',
        isLoading: false,
        isUpdating: true,
      });

      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2023' }) }));

      // Assert
      expect(screen.getByTestId('updating-page')).toBeInTheDocument();
      expect(screen.queryByTestId('top-names')).not.toBeInTheDocument();
    });

    it('debería llamar a notFound cuando statistics es null y no está cargando', async () => {
      // Arrange
      const { notFound } = await import('next/navigation');
      const { useYearContext } = await import(
        '@/app/(frontend)/statistics/[year]/context/useYearContext'
      );
      const { useYear } = await import('@/app/(frontend)/statistics/[year]/hooks/useYear');

      vi.mocked(useYearContext).mockReturnValue({
        statistics: null,
        setStatistics: vi.fn(),
        year: '2023',
      });

      vi.mocked(useYear).mockReturnValue({
        year: '2023',
        isLoading: false,
        isUpdating: false,
      });

      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2023' }) }));

      // Assert
      expect(notFound).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('top-names')).not.toBeInTheDocument();
    });
  });

  describe('Diferentes años', () => {
    it('debería renderizar correctamente con año 2022', async () => {
      // Arrange
      const { useYear } = await import('@/app/(frontend)/statistics/[year]/hooks/useYear');
      vi.mocked(useYear).mockReturnValue({
        year: '2022',
        isLoading: false,
        isUpdating: false,
      });

      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2022' }) }));

      // Assert
      expect(screen.getByText('Tamborrada Infantil 2022')).toBeInTheDocument();
    });

    it('debería renderizar correctamente con año 2024', async () => {
      // Arrange
      const { useYear } = await import('@/app/(frontend)/statistics/[year]/hooks/useYear');
      vi.mocked(useYear).mockReturnValue({
        year: '2024',
        isLoading: false,
        isUpdating: false,
      });

      // Act
      render(await YearPage({ params: Promise.resolve({ year: '2024' }) }));

      // Assert
      expect(screen.getByText('Tamborrada Infantil 2024')).toBeInTheDocument();
    });
  });
});
