import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/(backend)/api/statistics/route';
import { getStatistics } from '@/app/(backend)/logic/statistics/getStatistics';
import { groupBy } from '@/app/(backend)/logic/helpers/groupBy';
import { VALID_YEARS } from '@/app/(backend)/utils/constants';

// Mock de las dependencias
vi.mock('@/app/(backend)/logic/statistics/getStatistics', () => ({
  getStatistics: vi.fn(),
}));

vi.mock('@/app/(backend)/logic/helpers/groupBy', () => ({
  groupBy: vi.fn(),
}));

vi.mock('@/app/(backend)/utils/constants', async () => {
  const actual = await vi.importActual('@/app/(backend)/utils/constants');
  return {
    ...actual,
    VALID_YEARS: vi.fn(),
  };
});

describe('API /api/statistics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET - Casos exitosos', () => {
    it('debería devolver estadísticas correctas con year=2022', async () => {
      // Arrange
      const mockStats = [
        { category: 'topNamesByYear', public_data: { data: 'test1' }, summary: 'summary1' },
        { category: 'topSchoolsByYear', public_data: { data: 'test2' }, summary: 'summary2' },
      ];
      const mockGroupedStats = {
        topNamesByYear: [mockStats[0]],
        topSchoolsByYear: [mockStats[1]],
      };

      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023', '2022', '2021', 'global']);
      vi.mocked(getStatistics).mockResolvedValue(mockStats);
      vi.mocked(groupBy).mockReturnValue(mockGroupedStats);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('year');
      expect(data).toHaveProperty('total_categories');
      expect(data).toHaveProperty('statistics');
      expect(data.year).toBe('2022');
      expect(data.total_categories).toBe(2);
      expect(data.statistics).toEqual(mockGroupedStats);
      expect(getStatistics).toHaveBeenCalledWith('2022');
    });

    it('debería funcionar con year=global', async () => {
      // Arrange
      const mockStats = [
        { category: 'topNames', public_data: { global: true }, summary: 'global summary' },
      ];
      const mockGroupedStats = {
        topNames: [mockStats[0]],
      };

      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023', 'global']);
      vi.mocked(getStatistics).mockResolvedValue(mockStats);
      vi.mocked(groupBy).mockReturnValue(mockGroupedStats);

      const mockUrl = 'http://localhost:3000/api/statistics?year=global';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.year).toBe('global');
      expect(data.statistics).toEqual(mockGroupedStats);
      expect(getStatistics).toHaveBeenCalledWith('global');
    });

    it('debería llamar a groupBy con los datos correctos', async () => {
      // Arrange
      const mockStats = [
        { category: 'cat1', public_data: {}, summary: '' },
        { category: 'cat2', public_data: {}, summary: '' },
      ];

      vi.mocked(VALID_YEARS).mockResolvedValue(['2022', 'global']);
      vi.mocked(getStatistics).mockResolvedValue(mockStats);
      vi.mocked(groupBy).mockReturnValue({});

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      await GET(mockRequest);

      // Assert
      expect(groupBy).toHaveBeenCalledWith(mockStats, 'category');
    });

    it('debería devolver el total de categorías correctamente', async () => {
      // Arrange
      const mockStats = [
        { category: 'cat1', public_data: {}, summary: '' },
        { category: 'cat2', public_data: {}, summary: '' },
        { category: 'cat3', public_data: {}, summary: '' },
      ];

      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockResolvedValue(mockStats);
      vi.mocked(groupBy).mockReturnValue({});

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(data.total_categories).toBe(3);
    });

    it('debería agrupar correctamente las estadísticas por categoría', async () => {
      // Arrange
      const mockStats = [
        { category: 'topNames', public_data: { rank: 1 }, summary: 's1' },
        { category: 'topNames', public_data: { rank: 2 }, summary: 's2' },
        { category: 'topSchools', public_data: { rank: 1 }, summary: 's3' },
      ];
      const mockGroupedStats = {
        topNames: [mockStats[0], mockStats[1]],
        topSchools: [mockStats[2]],
      };

      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockResolvedValue(mockStats);
      vi.mocked(groupBy).mockReturnValue(mockGroupedStats);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(data.statistics.topNames).toHaveLength(2);
      expect(data.statistics.topSchools).toHaveLength(1);
    });
  });

  describe('GET - Validación de parámetro year obligatorio', () => {
    it('debería devolver 400 si falta el parámetro year', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/statistics';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe("Parametro 'year' es obligatorio");
    });

    it('no debería llamar a getStatistics si falta year', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/statistics';
      const mockRequest = new Request(mockUrl);

      // Act
      await GET(mockRequest);

      // Assert
      expect(getStatistics).not.toHaveBeenCalled();
    });
  });

  describe('GET - Validación de formato de año', () => {
    it('debería devolver 400 con año en formato inválido: 33333', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/statistics?year=33333';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Formato de año inválido');
    });

    it('debería devolver 400 con año en formato inválido: abc2022', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/statistics?year=abc2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Formato de año inválido');
    });

    it('debería devolver 400 con año de 3 dígitos: 202', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/statistics?year=202';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Formato de año inválido');
    });

    it('debería devolver 400 con caracteres especiales: @2022', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/statistics?year=@2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Formato de año inválido');
    });

    it('debería aceptar "global" como año válido sin validar formato', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', 'global']);
      vi.mocked(getStatistics).mockResolvedValue([
        { category: 'test', public_data: {}, summary: '' },
      ]);
      vi.mocked(groupBy).mockReturnValue({});

      const mockUrl = 'http://localhost:3000/api/statistics?year=global';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);

      // Assert
      expect(response.status).toBe(200);
    });

    it('debería aceptar años con formato correcto: 2018-2030', async () => {
      // Arrange
      const validYears = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
      vi.mocked(VALID_YEARS).mockResolvedValue(validYears);
      vi.mocked(getStatistics).mockResolvedValue([
        { category: 'test', public_data: {}, summary: '' },
      ]);
      vi.mocked(groupBy).mockReturnValue({});

      for (const year of validYears) {
        const mockUrl = `http://localhost:3000/api/statistics?year=${year}`;
        const mockRequest = new Request(mockUrl);

        // Act
        const response = await GET(mockRequest);

        // Assert
        expect(response.status).toBe(200);
      }
    });
  });

  describe('GET - Validación de año disponible', () => {
    it('debería devolver 400 si el año no está en la lista de años válidos', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023', '2022', 'global']);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2015';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toContain('Año inválido');
      expect(data.error).toContain('Años válidos');
    });

    it('debería devolver 400 con un año futuro no disponible', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023', '2022']);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2030';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toContain('Año inválido');
    });

    it('debería llamar a VALID_YEARS para validar el año', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022', 'global']);
      vi.mocked(getStatistics).mockResolvedValue([
        { category: 'test', public_data: {}, summary: '' },
      ]);
      vi.mocked(groupBy).mockReturnValue({});

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      await GET(mockRequest);

      // Assert
      expect(VALID_YEARS).toHaveBeenCalledTimes(1);
    });

    it('debería mostrar los primeros 4 años válidos en el mensaje de error', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue([
        '2024',
        '2023',
        '2022',
        '2021',
        '2020',
        '2019',
        'global',
      ]);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2015';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(data.error).toContain('2024, 2023, 2022, 2021');
    });
  });

  describe('GET - Manejo de datos vacíos', () => {
    it('debería devolver 404 si no hay datos para el año', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022', 'global']);
      vi.mocked(getStatistics).mockResolvedValue(null);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.message).toContain('No hay datos');
      expect(data.message).toContain('2022');
    });

    it('debería devolver 404 si getStatistics devuelve array vacío', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022', 'global']);
      vi.mocked(getStatistics).mockResolvedValue([]);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.message).toContain('No hay datos');
    });

    it('no debería llamar a groupBy si no hay datos', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockResolvedValue(null);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      await GET(mockRequest);

      // Assert
      expect(groupBy).not.toHaveBeenCalled();
    });
  });

  describe('GET - Manejo de errores', () => {
    it('debería devolver 500 si ocurre un error inesperado', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockRejectedValue(new Error('Database error'));

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Error al obtener el estado del sistema');
      expect(data).toHaveProperty('details');
    });

    it('debería incluir detalles del error en la respuesta 500', async () => {
      // Arrange
      const mockError = new Error('Connection timeout');
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockRejectedValue(mockError);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.details).toBeTruthy();
      expect(typeof data.details).toBe('string');
    });
  });

  describe('GET - Estructura de datos retornados', () => {
    it('debería devolver un objeto con la estructura correcta', async () => {
      // Arrange
      const mockStats = [{ category: 'test', public_data: {}, summary: '' }];
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockResolvedValue(mockStats);
      vi.mocked(groupBy).mockReturnValue({ test: [mockStats[0]] });

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(data).toHaveProperty('year');
      expect(data).toHaveProperty('total_categories');
      expect(data).toHaveProperty('statistics');
      expect(typeof data.year).toBe('string');
      expect(typeof data.total_categories).toBe('number');
      expect(typeof data.statistics).toBe('object');
    });

    it('debería devolver statistics como objeto agrupado por categoría', async () => {
      // Arrange
      const mockStats = [
        { category: 'cat1', public_data: {}, summary: '' },
        { category: 'cat2', public_data: {}, summary: '' },
      ];
      const mockGrouped = {
        cat1: [mockStats[0]],
        cat2: [mockStats[1]],
      };
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockResolvedValue(mockStats);
      vi.mocked(groupBy).mockReturnValue(mockGrouped);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(Object.keys(data.statistics)).toEqual(['cat1', 'cat2']);
      expect(Array.isArray(data.statistics.cat1)).toBe(true);
      expect(Array.isArray(data.statistics.cat2)).toBe(true);
    });

    it('debería mantener las propiedades de cada estadística', async () => {
      // Arrange
      const mockStats = [
        {
          category: 'topNames',
          public_data: { names: ['Juan', 'María'] },
          summary: 'Top names summary',
        },
      ];
      const mockGrouped = { topNames: [mockStats[0]] };
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockResolvedValue(mockStats);
      vi.mocked(groupBy).mockReturnValue(mockGrouped);

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      const stat = data.statistics.topNames[0];
      expect(stat).toHaveProperty('category');
      expect(stat).toHaveProperty('public_data');
      expect(stat).toHaveProperty('summary');
      expect(stat.public_data.names).toEqual(['Juan', 'María']);
    });
  });

  describe('GET - Integración de validaciones', () => {
    it('debería validar en orden: parámetro -> formato año -> año válido', async () => {
      // 1. Falta parámetro (primera validación)
      let mockUrl = 'http://localhost:3000/api/statistics';
      let response = await GET(new Request(mockUrl));
      expect(response.status).toBe(400);
      expect((await response.json()).error).toContain('obligatorio');

      // 2. Formato año inválido (segunda validación)
      mockUrl = 'http://localhost:3000/api/statistics?year=abc';
      response = await GET(new Request(mockUrl));
      expect(response.status).toBe(400);
      expect((await response.json()).error).toContain('Formato de año inválido');

      // 3. Año no disponible (tercera validación)
      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023']);
      mockUrl = 'http://localhost:3000/api/statistics?year=2015';
      response = await GET(new Request(mockUrl));
      expect(response.status).toBe(400);
      expect((await response.json()).error).toContain('Año inválido');
    });

    it('debería llamar a getStatistics solo si todas las validaciones pasan', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getStatistics).mockResolvedValue([
        { category: 'test', public_data: {}, summary: '' },
      ]);
      vi.mocked(groupBy).mockReturnValue({});

      const mockUrl = 'http://localhost:3000/api/statistics?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      await GET(mockRequest);

      // Assert
      expect(getStatistics).toHaveBeenCalledTimes(1);
      expect(getStatistics).toHaveBeenCalledWith('2022');
    });
  });
});
