import { ReportService } from "../src/controllers/geoReport.controller";
import { ReportModel } from "../src/models/geoReport.model";

// Mock del modelo de MongoDB
jest.mock("../src/models/geoReport.model");

describe("ReportService - Tests Sencillos", () => {
  let service: ReportService;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
    service = new ReportService();
  });

  // ============================================
  // TEST 1: Crear reporte exitoso
  // ============================================
  test("Debería crear un reporte exitosamente", async () => {
    // Datos de prueba
    const reportData = {
      title: "Bache en avenida",
      description: "Bache de 50cm de diámetro",
      category: "pothole",
      location: {
        coordinates: [-99.1332, 19.4326],
        city: "CDMX",
        country: "México"
      }
    };

    // Mock: Simular que MongoDB guarda correctamente
    const mockSavedReport = {
      _id: "507f1f77bcf86cd799439011",
      ...reportData,
      trackingCode: "REP-123456",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Configurar el mock para que devuelva el reporte guardado
    (ReportModel as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockSavedReport)
    }));

    // Ejecutar la función del servicio
    const result = await service.createReport(reportData);

    // Verificar resultados
    expect(result).toBeDefined();
    expect(result._id).toBe("507f1f77bcf86cd799439011");
    expect(result.trackingCode).toBe("REP-123456");
    expect(result.status).toBe("pending");
    
    // Verificar que se llamó a save()
    expect(ReportModel).toHaveBeenCalled();
  });

  // ============================================
  // TEST 2: Error al guardar en MongoDB
  // ============================================
  test("Debería lanzar error si MongoDB falla", async () => {
    const reportData = {
      title: "Test error",
      description: "Test",
      category: "pothole",
      location: {
        coordinates: [-99.1332, 19.4326],
        city: "CDMX",
        country: "México"
      }
    };

    // Mock: Simular error de MongoDB
    (ReportModel as any).mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Error de conexión a MongoDB"))
    }));

    // Verificar que la función lanza error
    await expect(service.createReport(reportData))
      .rejects
      .toThrow("Error de conexión a MongoDB");
  });

  // ============================================
  // TEST 3: Obtener reporte por ID
  // ============================================
  test("Debería obtener reporte por ID", async () => {
    const mockReport = {
      _id: "507f1f77bcf86cd799439011",
      title: "Bache reparado",
      status: "resolved"
    };

    // Mock de findById
    (ReportModel.findById as jest.Mock).mockResolvedValue(mockReport);

    const result = await service.getReportById("507f1f77bcf86cd799439011");

    expect(result).toEqual(mockReport);
    expect(ReportModel.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });

  // ============================================
  // TEST 4: Reporte no encontrado
  // ============================================
  test("Debería retornar null si reporte no existe", async () => {
    // Mock: findById retorna null
    (ReportModel.findById as jest.Mock).mockResolvedValue(null);

    const result = await service.getReportById("id_inexistente");

    expect(result).toBeNull();
  });

  // ============================================
  // TEST 5: Eliminar reporte
  // ============================================
  test("Debería eliminar reporte por ID", async () => {
    const mockDeletedReport = {
      _id: "507f1f77bcf86cd799439011",
      title: "Bache eliminado"
    };

    // Mock de findByIdAndDelete
    (ReportModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedReport);

    const result = await service.deleteReport("507f1f77bcf86cd799439011");

    expect(result).toEqual(mockDeletedReport);
    expect(ReportModel.findByIdAndDelete).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });
});