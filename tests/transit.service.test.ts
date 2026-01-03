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
});