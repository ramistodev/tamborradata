import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/(backend)/oldApi/available-years/route';
import { getAvailableYears } from '@/app/(backend)/logic/years/getAvailableYears';

// Mock de la función getAvailableYears
vi.mock('@/app/(backend)/logic/years/getAvailableYears', () => ({
  getAvailableYears: vi.fn(),
}));

describe('API /api/available-years', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('debería devolver un objeto con la estructura { years: number[] }', async () => {
      // Arrange: simular que getAvailableYears devuelve años válidos
      const mockYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
      vi.mocked(getAvailableYears).mockResolvedValue(mockYears);

      // Act: llamar a la API
      const response = await GET();
      const data = await response.json();

      // Assert: verificar estructura del objeto
      expect(data).toHaveProperty('years');
      expect(Array.isArray(data.years)).toBe(true);
      expect(data.years).toEqual(mockYears);
    });

    it('debería devolver un array de números', async () => {
      // Arrange
      const mockYears = [2024, 2023, 2022];
      vi.mocked(getAvailableYears).mockResolvedValue(mockYears);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert: todos los elementos deben ser números
      expect(data.years.every((year: any) => typeof year === 'number')).toBe(true);
    });

    it('debería devolver los años ordenados descendentemente', async () => {
      // Arrange
      const mockYears = [2024, 2023, 2022, 2021];
      vi.mocked(getAvailableYears).mockResolvedValue(mockYears);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert: verificar orden descendente
      const sorted = [...data.years].sort((a: number, b: number) => b - a);
      expect(data.years).toEqual(sorted);
    });

    it('debería devolver un array vacío si no hay años disponibles', async () => {
      // Arrange: simular que no hay años
      vi.mocked(getAvailableYears).mockResolvedValue(null);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(data.years).toEqual([]);
      expect(Array.isArray(data.years)).toBe(true);
    });

    it('debería devolver status 200 en caso de éxito', async () => {
      // Arrange
      const mockYears = [2024, 2023];
      vi.mocked(getAvailableYears).mockResolvedValue(mockYears);

      // Act
      const response = await GET();

      // Assert
      expect(response.status).toBe(200);
    });

    it('debería manejar errores y devolver status 500', async () => {
      // Arrange: simular un error en getAvailableYears
      const mockError = new Error('Database connection failed');
      vi.mocked(getAvailableYears).mockRejectedValue(mockError);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Error al obtener el estado del sistema');
      expect(data).toHaveProperty('details');
    });

    it('debería devolver un objeto con la propiedad "details" en caso de error', async () => {
      // Arrange
      vi.mocked(getAvailableYears).mockRejectedValue(new Error('Test error'));

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('details');
      expect(typeof data.details).toBe('string');
    });

    it('no debería devolver años duplicados', async () => {
      // Arrange
      const mockYears = [2024, 2023, 2022, 2021];
      vi.mocked(getAvailableYears).mockResolvedValue(mockYears);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert: verificar que no hay duplicados
      const uniqueYears = [...new Set(data.years)];
      expect(data.years).toEqual(uniqueYears);
    });

    it('debería devolver años válidos (números entre 2000 y año actual + 1)', async () => {
      // Arrange
      const mockYears = [2024, 2023, 2022];
      vi.mocked(getAvailableYears).mockResolvedValue(mockYears);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert: todos los años deben estar en un rango razonable
      const currentYear = new Date().getFullYear();
      expect(data.years.every((year: number) => year >= 2000 && year <= currentYear + 1)).toBe(
        true
      );
    });

    it('debería llamar a getAvailableYears exactamente una vez', async () => {
      // Arrange
      vi.mocked(getAvailableYears).mockResolvedValue([2024]);

      // Act
      await GET();

      // Assert
      expect(getAvailableYears).toHaveBeenCalledTimes(1);
    });
  });
});
