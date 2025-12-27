import { GeoNameService } from "../src/services/geonames.service";
import { CityModel } from "../src/models/city.model";

// 1. MOCKEAMOS EL MODELO DE MONGO
// Le decimos a Jest: "No uses el archivo real, usa uno falso"
jest.mock("../src/models/city.model");

// 2. Mockeamos fetch globalmente
global.fetch = jest.fn();

describe("Servicio GeoNames", () => {
  // Limpiamos los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debería traer datos completos (lat, lng) de una ciudad", async () => {
    // A. Simulamos que la BD está vacía
    // Cuando el código llame a findOne, devolvemos null instantáneamente
    (CityModel.findOne as jest.Mock).mockResolvedValue(null);

    // B. Simulamos el guardado (create) para que no haga nada
    (CityModel.create as jest.Mock).mockResolvedValue({});

    // C. Simulamos la respuesta de la API externa (GeoNames)
    const mockApiResponse = {
      geonames: [
        {
          name: "Madrid",
          lat: "40.4165",
          lng: "-3.70256",
          countryName: "Spain",
          population: 3000000,
          bbox: {
            east: 10,
            south: 10,
            north: 20,
            west: 20,
            accuracyLevel: 5,
          },
          timezone: {
            gmtOffset: 1,
            timeZoneId: "Europe/Madrid",
            dstOffset: 2,
          },
        },
      ],
    };

    // Configuramos el fetch falso para devolver eso
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    // --- EJECUCIÓN (ACT) ---
    const service = new GeoNameService();
    const result = await service.getCityDetails("Madrid");

    // --- VERIFICACIÓN (ASSERT) ---
    expect(result).toBeDefined();
    expect(result?.name).toBe("Madrid");
    expect(result?.latitude).toBe("40.4165");

    // Verificamos que intentó buscar en la BD primero
    expect(CityModel.findOne).toHaveBeenCalled();
  });
});
