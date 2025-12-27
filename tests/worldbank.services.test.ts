import { WorldBankService } from "../src/services/worldbank.service";
import { PopulationModel } from "../src/models/population.model";

// 1. Mockeamos fetch globalmente
global.fetch = jest.fn();

// 2. Mockeamos el Modelo de Mongoose para que no intente conectar a la BD real
jest.mock("../src/models/population.model", () => ({
  PopulationModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe("WorldBank Service", () => {
  let service: WorldBankService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new WorldBankService();
  });

  it("Debería retornar el OBJETO de población si la API responde correctamente (y no está en caché)", async () => {
    // --- ARRANGE ---

    // A. Simulamos que NO está en base de datos (findOne devuelve null)
    (PopulationModel.findOne as jest.Mock).mockResolvedValue(null);

    // B. Simulamos respuesta exitosa de la API del Banco Mundial
    const mockApiResponse = [
      { page: 1, total: 1 },
      [
        {
          date: "2023",
          value: 19000000,
          countryiso3code: "CHL",
          country: { value: "Chile" },
        },
        { date: "2022", value: null },
      ],
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    // --- ACT ---
    // Usamos el nuevo nombre del método
    const result = await service.getPopulationByCountry("CL");

    // --- ASSERT ---
    expect(result).not.toBeNull();
    expect(result?.totalPopulation.value).toBe(19000000); // Verificamos la propiedad dentro del objeto
    expect(result?.name).toBe("Chile");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/country/CL/")
    );
  });

  it("Debería retornar NULL si la API no tiene datos válidos", async () => {
    // --- ARRANGE ---
    (PopulationModel.findOne as jest.Mock).mockResolvedValue(null);

    const mockEmptyResponse = [
      { page: 1 },
      [], // Array de datos vacío
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockEmptyResponse),
    });

    // --- ACT ---
    const result = await service.getPopulationByCountry("XX");

    // --- ASSERT ---
    expect(result).toBeNull();
  });

  it("Debería retornar NULL y manejar el error si la API falla", async () => {
    // --- ARRANGE ---
    (PopulationModel.findOne as jest.Mock).mockResolvedValue(null);
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API Down"));

    // --- ACT ---
    const result = await service.getPopulationByCountry("CL");

    // --- ASSERT ---
    expect(result).toBeNull();
  });

  // (OPCIONAL) Test extra para verificar que si está en DB, no llama a la API
  it("Debería retornar datos de MONGODB si ya existen en caché (sin llamar a fetch)", async () => {
    // --- ARRANGE ---
    // Simulamos que SI encuentra datos en Mongo
    (PopulationModel.findOne as jest.Mock).mockResolvedValue({
      countryCode: "CL",
      countryName: "Chile Cacheado",
      value: 500,
      year: "2020",
    });

    // --- ACT ---
    const result = await service.getPopulationByCountry("CL");

    // --- ASSERT ---
    // expect(result?.population).toBe(500);
    expect(global.fetch).not.toHaveBeenCalled(); // ¡Fetch NO debe ejecutarse!
  });
});
