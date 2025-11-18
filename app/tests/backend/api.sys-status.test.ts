import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/(backend)/api/sys-status/route';
import { getSysStatus } from '@/app/(backend)/logic/sysStatus/getSysStatus';

// Mock de la función getSysStatus
vi.mock('@/app/(backend)/logic/sysStatus/getSysStatus', () => ({
  getSysStatus: vi.fn(),
}));

describe('API /api/sys-status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET - Casos exitosos', () => {
    it('debería devolver el estado del sistema correctamente', async () => {
      // Arrange
      const mockSysStatus = { is_updating: false };
      vi.mocked(getSysStatus).mockResolvedValue(mockSysStatus);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(mockSysStatus);
      expect(getSysStatus).toHaveBeenCalledTimes(1);
    });

    it('debería devolver is_updating: true cuando el sistema está actualizando', async () => {
      // Arrange
      const mockSysStatus = { is_updating: true };
      vi.mocked(getSysStatus).mockResolvedValue(mockSysStatus);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.is_updating).toBe(true);
    });

    it('debería devolver is_updating: false cuando el sistema no está actualizando', async () => {
      // Arrange
      const mockSysStatus = { is_updating: false };
      vi.mocked(getSysStatus).mockResolvedValue(mockSysStatus);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.is_updating).toBe(false);
    });

    it('debería devolver un objeto con la propiedad is_updating', async () => {
      // Arrange
      const mockSysStatus = { is_updating: false };
      vi.mocked(getSysStatus).mockResolvedValue(mockSysStatus);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(data).toHaveProperty('is_updating');
      expect(typeof data.is_updating).toBe('boolean');
    });
  });

  describe('GET - Manejo de datos no encontrados', () => {
    it('debería devolver 404 si no hay información del sistema', async () => {
      // Arrange
      vi.mocked(getSysStatus).mockResolvedValue(null);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('No se encontró información del sistema');
    });

    it('debería llamar a getSysStatus incluso si no hay datos', async () => {
      // Arrange
      vi.mocked(getSysStatus).mockResolvedValue(null);

      // Act
      await GET();

      // Assert
      expect(getSysStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET - Manejo de errores', () => {
    it('debería devolver 500 si ocurre un error inesperado', async () => {
      // Arrange
      vi.mocked(getSysStatus).mockRejectedValue(new Error('Database connection failed'));

      // Act
      const response = await GET();
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
      vi.mocked(getSysStatus).mockRejectedValue(mockError);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.details).toBeTruthy();
      expect(typeof data.details).toBe('string');
    });
  });

  describe('GET - Sin parámetros', () => {
    it('no debería requerir ningún parámetro en la URL', async () => {
      // Arrange
      const mockSysStatus = { is_updating: false };
      vi.mocked(getSysStatus).mockResolvedValue(mockSysStatus);

      // Act
      const response = await GET();

      // Assert
      expect(response.status).toBe(200);
      expect(getSysStatus).toHaveBeenCalledWith();
    });
  });
});
