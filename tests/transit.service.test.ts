import { TflService } from "../src/services/tfl.service";

// 1. Mock Global de Fetch
// Esto evita que Jest intente conectarse a internet real durante las pruebas.
global.fetch = jest.fn();

describe("TflService", () => {
  let service: TflService;

  // Antes de cada test, reiniciamos la instancia y limpiamos los mocks
  beforeEach(() => {
    service = new TflService();
    jest.clearAllMocks();
  });

  // CASO 1: Éxito (Happy Path)
  it("debe obtener rutas, filtrar por modos y mapear a JSON correctamente", async () => {
    // A. Preparamos los datos falsos que simulan la respuesta de la API de TfL
    const mockApiResponse = [
      {
        name: "Bakerloo",
        modeName: "tube",
        lineStatuses: [
          {
            statusSeverityDescription: "Good Service",
            reason: "",
          },
        ],
      },
      {
        name: "Liberty",
        modeName: "overground",
        lineStatuses: [
          {
            statusSeverityDescription: "Part Closure",
            reason: "No service between Romford and Upminster",
          },
        ],
      },
    ];

    // B. Configuramos el mock para que devuelva estos datos
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    // C. Ejecutamos el servicio
    const result = await service.getTransitRoutes("london");

    // D. Verificaciones (Asserts)
    
    // 1. Verificamos que fetch se llamó con la URL correcta (incluyendo los modos nuevos)
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const urlCalled = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(urlCalled).toContain("/Line/Mode/tube,overground,dlr,elizabeth-line/Status");

    // 2. Verificamos que el resultado tenga la estructura de nuestra Interfaz limpia
    expect(result).toEqual([
      {
        route: "Bakerloo",
        mode: "tube",          // <--- Verificamos el nuevo campo
        status: "Good Service",
        details: "",
      },
      {
        route: "Liberty",
        mode: "overground",    // <--- Verificamos el nuevo campo
        status: "Part Closure",
        details: "No service between Romford and Upminster",
      },
    ]);
  });

  // CASO 2: Ciudad Incorrecta
  it("debe retornar null si la ciudad no es 'london'", async () => {
    const result = await service.getTransitRoutes("Paris");

    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled(); // No debe llamar a la API
  });

  // CASO 3: Error de la API
  it("debe lanzar un error si la API de TfL falla", async () => {
    // Simulamos un error 500 o 401 de la API
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: "Unauthorized",
    });

    // Esperamos que la promesa sea rechazada
    // await expect(service.getTransitRoutes("london")).rejects.toThrow(
    //   "TfL API Error: Unauthorized"
    // );
    await expect(service.getTransitRoutes("london")).rejects.toThrow(
        "Fetch error in TFL: Unauthorized" // <--- Esto coincide con tu código real
    );
  });

  describe("getEta", () => {
    
    it("debe obtener ETA, ordenar por tiempo y formatear minutos", async () => {
      const stopId = "940GZZLUBST";
      
      // MOCK DATA: El tren lento (300s) primero, el rápido (60s) segundo
      const mockArrivals = [
        {
          lineName: "Bakerloo",
          destinationName: "Elephant & Castle",
          platformName: "Platform 3",
          timeToStation: 300, 
          expectedArrival: "2026-01-04T20:05:00Z"
        },
        {
          lineName: "Circle",
          destinationName: "Edgware Road",
          platformName: "Platform 1",
          timeToStation: 60, 
          expectedArrival: "2026-01-04T20:01:00Z"
        },
      ];

      // Simulamos respuesta exitosa
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockArrivals,
      });

      // AQUÍ USAMOS 'service' (que viene del describe padre)
      const result = await service.getEta(stopId);

      // Verificaciones
      expect(global.fetch).toHaveBeenCalled();
      const urlCalled = (global.fetch as jest.Mock).mock.calls[0][0]; // Verificamos la última llamada (o la única en este test)
      expect(urlCalled).toContain(`/StopPoint/${stopId}/Arrivals`);

      expect(result).toHaveLength(2);
      
      // Verificar ORDENAMIENTO (El de 60s debe ir primero)
      expect(result[0].line).toBe("Circle");
      expect(result[0].timeToStation).toBe(60);
      expect(result[0].expectedArrival).toBe("2026-01-04T20:01:00Z");

      // El segundo debe ser el de 300s
      expect(result[1].line).toBe("Bakerloo");
      expect(result[1].timeToStation).toBe(300);
      expect(result[1].expectedArrival).toBe("2026-01-04T20:05:00Z");
    });

    it("debe devolver array vacío si la estación no existe (404)", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404, 
        json: async () => ({}),
      });

      const result = await service.getEta("INVALID_ID");

      expect(result).toEqual([]);
    });

    it("debe lanzar error si falla la conexión (500)", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(service.getEta("940GZZLUBST")).rejects.toThrow(
        "Fetch error in TFL: Internal Server Error"
      );
    });

  });

});

