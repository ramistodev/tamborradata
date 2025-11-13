import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/(backend)/api/category/route';
import { getFullStatistics } from '@/app/(backend)/logic/statistics/getFullStatistics';
import { VALID_YEARS } from '@/app/(backend)/utils/constants';

// Mock de las dependencias
vi.mock('@/app/(backend)/logic/statistics/getFullStatistics', () => ({
  getFullStatistics: vi.fn(),
}));

vi.mock('@/app/(backend)/utils/constants', async () => {
  const actual = await vi.importActual('@/app/(backend)/utils/constants');
  return {
    ...actual,
    VALID_YEARS: vi.fn(),
  };
});

describe('API /api/category', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET - Casos exitosos', () => {
    it('debería devolver estadísticas correctas con year=2022&category=topNamesByYear', async () => {
      // Arrange
      const mockStats = [
        { name: 'Juan', count: 150 },
        { name: 'María', count: 140 },
      ];
      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023', '2022', '2021', 'global']);
      vi.mocked(getFullStatistics).mockResolvedValue(mockStats);

      const mockUrl = 'http://localhost:3000/api/category?year=2022&category=topNamesByYear';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('stats');
      expect(data.stats).toEqual(mockStats);
      expect(getFullStatistics).toHaveBeenCalledWith('2022', 'topNamesByYear');
    });

    it('debería funcionar con year=global y cualquier categoría válida', async () => {
      // Arrange
      const mockStats = [{ school: 'Colegio A', count: 500 }];
      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023', 'global']);
      vi.mocked(getFullStatistics).mockResolvedValue(mockStats);

      const mockUrl = 'http://localhost:3000/api/category?year=global&category=topSchools';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.stats).toEqual(mockStats);
      expect(getFullStatistics).toHaveBeenCalledWith('global', 'topSchools');
    });

    it('debería aceptar todas las categorías válidas', async () => {
      // Arrange
      const validCategories = [
        'commonNameBySchool',
        'topNamesByYear',
        'longestNames',
        'schoolsEvolution',
      ];
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022', 'global']);
      vi.mocked(getFullStatistics).mockResolvedValue([{ data: 'test' }]);

      // Act & Assert
      for (const category of validCategories) {
        const mockUrl = `http://localhost:3000/api/category?year=2022&category=${category}`;
        const mockRequest = new Request(mockUrl);
        const response = await GET(mockRequest);

        expect(response.status).toBe(200);
        expect(getFullStatistics).toHaveBeenCalledWith('2022', category);
      }
    });
  });

  describe('GET - Validación de parámetros obligatorios', () => {
    it('debería devolver 400 si falta el parámetro year', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/category?category=topNamesByYear';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe("Parametros 'year' y 'category' son obligatorios");
    });

    it('debería devolver 400 si falta el parámetro category', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/category?year=2022';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe("Parametros 'year' y 'category' son obligatorios");
    });

    it('debería devolver 400 si faltan ambos parámetros', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/category';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe("Parametros 'year' y 'category' son obligatorios");
    });
  });

  describe('GET - Validación de categoría', () => {
    it('debería devolver 400 si la categoría no es válida', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/category?year=2022&category=invalidCategory';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Categoría inválida. Esa categoria no existe');
    });

    it('debería rechazar categorías con typos', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/category?year=2022&category=topNmesByYear';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Categoría inválida. Esa categoria no existe');
    });
  });

  describe('GET - Validación de formato de año', () => {
    it('debería devolver 400 con año en formato inválido: 33333', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/category?year=33333&category=topNamesByYear';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Formato de año inválido');
    });

    it('debería devolver 400 con año en formato inválido: hsh22', async () => {
      // Arrange
      const mockUrl = 'http://localhost:3000/api/category?year=hsh22&category=topNamesByYear';
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
      const mockUrl = 'http://localhost:3000/api/category?year=202&category=topNamesByYear';
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
      const mockUrl = 'http://localhost:3000/api/category?year=@2022&category=topNamesByYear';
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
      vi.mocked(getFullStatistics).mockResolvedValue([{ data: 'test' }]);

      const mockUrl = 'http://localhost:3000/api/category?year=global&category=topNames';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);

      // Assert
      expect(response.status).toBe(200);
      // No debe validar formato para "global"
    });
  });

  describe('GET - Validación de año disponible', () => {
    it('debería devolver 400 si el año no está en la lista de años válidos', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023', '2022', 'global']);

      const mockUrl = 'http://localhost:3000/api/category?year=2015&category=topNamesByYear';
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

      const mockUrl = 'http://localhost:3000/api/category?year=2030&category=topNamesByYear';
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
      vi.mocked(getFullStatistics).mockResolvedValue([{ data: 'test' }]);

      const mockUrl = 'http://localhost:3000/api/category?year=2022&category=topNamesByYear';
      const mockRequest = new Request(mockUrl);

      // Act
      await GET(mockRequest);

      // Assert
      expect(VALID_YEARS).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET - Manejo de datos vacíos', () => {
    it('debería devolver 404 si no hay datos para el año y categoría', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022', 'global']);
      vi.mocked(getFullStatistics).mockResolvedValue(null);

      const mockUrl = 'http://localhost:3000/api/category?year=2022&category=topNamesByYear';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.message).toContain('No hay datos');
      expect(data.message).toContain('2022');
      expect(data.message).toContain('topNamesByYear');
    });

    it('debería devolver 404 si getFullStatistics devuelve array vacío', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022', 'global']);
      vi.mocked(getFullStatistics).mockResolvedValue([]);

      const mockUrl = 'http://localhost:3000/api/category?year=2022&category=topNamesByYear';
      const mockRequest = new Request(mockUrl);

      // Act
      const response = await GET(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.message).toContain('No hay datos');
    });
  });

  describe('GET - Manejo de errores', () => {
    it('debería devolver 500 si ocurre un error inesperado', async () => {
      // Arrange
      vi.mocked(VALID_YEARS).mockResolvedValue(['2022']);
      vi.mocked(getFullStatistics).mockRejectedValue(new Error('Database error'));

      const mockUrl = 'http://localhost:3000/api/category?year=2022&category=topNamesByYear';
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
      vi.mocked(getFullStatistics).mockRejectedValue(mockError);

      const mockUrl = 'http://localhost:3000/api/category?year=2022&category=topNamesByYear';
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

  describe('GET - Integración de validaciones', () => {
    it('debería validar en orden: parámetros -> categoría -> formato año -> año válido', async () => {
      // Test que todas las validaciones se ejecutan en el orden correcto

      // 1. Falta parámetro (primera validación)
      let mockUrl = 'http://localhost:3000/api/category?category=topNamesByYear';
      let response = await GET(new Request(mockUrl));
      expect(response.status).toBe(400);
      expect((await response.json()).error).toContain('obligatorios');

      // 2. Categoría inválida (segunda validación)
      mockUrl = 'http://localhost:3000/api/category?year=2022&category=invalid';
      response = await GET(new Request(mockUrl));
      expect(response.status).toBe(400);
      expect((await response.json()).error).toContain('Categoría inválida');

      // 3. Formato año inválido (tercera validación)
      mockUrl = 'http://localhost:3000/api/category?year=abc&category=topNamesByYear';
      response = await GET(new Request(mockUrl));
      expect(response.status).toBe(400);
      expect((await response.json()).error).toContain('Formato de año inválido');

      // 4. Año no disponible (cuarta validación)
      vi.mocked(VALID_YEARS).mockResolvedValue(['2024', '2023']);
      mockUrl = 'http://localhost:3000/api/category?year=2015&category=topNamesByYear';
      response = await GET(new Request(mockUrl));
      expect(response.status).toBe(400);
      expect((await response.json()).error).toContain('Año inválido');
    });
  });
});
