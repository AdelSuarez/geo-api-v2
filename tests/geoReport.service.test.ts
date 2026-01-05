// src/tests/geoReport.service.test.ts
import { ReportService } from "../src/services/geoReport.service";
import { ReportModel } from "../src/models/geoReport.model";

// Mock del modelo
jest.mock("../src/models/geoReport.model");

describe("ReportService", () => {
  let service: ReportService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReportService();
  });

  describe("createReport", () => {
    it("Debería crear un reporte exitosamente", async () => {
      // Mock del reporte guardado
      const mockSavedReport = {
        _id: "new-report-id",
        title: "Bache en Avenida Principal",
        description: "Bache grande en la esquina",
        category: "pothole" as const,
        location: {
          coordinates: [-70.6483, -33.4569],
          address: "Avenida Principal 123",
          city: "Santiago",
          country: "Chile"
        },
        priority: "high" as const,
        trackingCode: "REP-123456",
        status: "pending" as const,
        metadata: {
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0",
          createdAt: new Date(),
          updatedAt: new Date(),
          estimatedResponseTime: "72 horas",
          similarReportsNearby: 0
        }
      };

      // Mock de save
      const mockSave = jest.fn().mockResolvedValue(mockSavedReport);
      (ReportModel as any).mockImplementation(() => ({ save: mockSave }));

      // Datos de entrada CON TIPOS CORRECTOS
      const reportData = {
        title: "Bache en Avenida Principal",
        description: "Bache grande en la esquina",
        category: "pothole" as const, // <-- Tipo específico, no string
        latitude: -33.4569,
        longitude: -70.6483,
        city: "Santiago",
        country: "Chile",
        address: "Avenida Principal 123",
        priority: "high" as const, // <-- Tipo específico
        userId: "user-123",
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0"
      };

      const result = await service.createReport(reportData);

      expect(result).toBeDefined();
      expect(result.id).toBe("new-report-id");
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });

  describe("getReportById", () => {
    it("Debería retornar un reporte por ID", async () => {
      const mockReportFromDB = {
        _id: "existing-id",
        title: "Reporte existente",
        description: "Descripción",
        category: "garbage" as const,
        location: {
          coordinates: [-70.6483, -33.4569],
          address: "Calle Test 123",
          city: "Santiago",
          country: "Chile"
        },
        priority: "medium" as const,
        trackingCode: "REP-EXIST123",
        status: "pending" as const,
        metadata: {
          ipAddress: "192.168.1.1",
          userAgent: "Chrome",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-16"),
          estimatedResponseTime: "72 horas",
          similarReportsNearby: 2
        },
        userId: "test-user",
        mediaUrls: ["url1.jpg", "url2.jpg"]
      };

      (ReportModel.findById as jest.Mock).mockResolvedValue(mockReportFromDB);

      const result = await service.getReportById("existing-id");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("existing-id");
    });

    it("Debería retornar null si no existe", async () => {
      (ReportModel.findById as jest.Mock).mockResolvedValue(null);
      const result = await service.getReportById("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("getAllReports", () => {
    it("Debería retornar lista de reportes", async () => {
      const mockReportsFromDB = [
        {
          _id: "report-1",
          title: "Primer reporte",
          description: "Desc 1",
          category: "pothole" as const,
          location: { coordinates: [1, 1], city: "City1", country: "Country1" },
          priority: "high" as const,
          trackingCode: "REP-001",
          status: "pending" as const,
          metadata: { 
            createdAt: new Date("2024-01-02"), 
            updatedAt: new Date("2024-01-02"),
            estimatedResponseTime: "72 horas",
            similarReportsNearby: 0
          }
        }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockReportsFromDB)
      };
      
      (ReportModel.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await service.getAllReports();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Primer reporte");
    });
  });

  describe("deleteReport", () => {
    it("Debería eliminar un reporte", async () => {
      const mockDeletedReport = {
        _id: "to-delete-id",
        title: "Reporte a eliminar",
        description: "Este será borrado",
        category: "safety" as const,
        location: { coordinates: [0, 0], city: "Test", country: "Test" },
        priority: "low" as const,
        trackingCode: "REP-DELETE",
        status: "pending" as const,
        metadata: { 
          createdAt: new Date(), 
          updatedAt: new Date(),
          estimatedResponseTime: "72 horas",
          similarReportsNearby: 0
        }
      };

      (ReportModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedReport);

      const result = await service.deleteReport("to-delete-id");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("to-delete-id");
    });
  });

  describe("updateReport", () => {
    it("Debería actualizar un reporte", async () => {
      const mockUpdatedReport = {
        _id: "update-id",
        title: "Título actualizado",
        description: "Descripción actualizada",
        category: "pothole" as const,
        location: { coordinates: [1, 1], city: "City", country: "Country" },
        priority: "critical" as const,
        trackingCode: "REP-UPDATE",
        status: "resolved" as const,
        metadata: {
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-03"),
          estimatedResponseTime: "72 horas",
          similarReportsNearby: 0
        }
      };

      (ReportModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedReport);

      const updateData = {
        title: "Título actualizado",
        status: "resolved" as const,
        priority: "critical" as const
      };

      const result = await service.updateReport("update-id", updateData);

      expect(result).not.toBeNull();
      expect(result?.title).toBe("Título actualizado");
    });
  });
});