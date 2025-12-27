import { WorldBankService } from "../src/services/worldbank.service";
import { PopulationModel } from "../src/models/population.model";

// 1. Mockeamos fetch globalmente
global.fetch = jest.fn();

// 2. Mockeamos el Modelo de Mongoose incluyendo 'create'
jest.mock("../src/models/population.model", () => ({
  PopulationModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));

describe("WorldBank Service", () => {
  let service: WorldBankService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new WorldBankService();
  });

  it("Debería retornar el OBJETO de población completo si la API responde correctamente", async () => {
    // A. Simulamos que NO está en base de datos
    (PopulationModel.findOne as jest.Mock).mockResolvedValue(null);

    // B. Simulamos respuesta exitosa para las 5 llamadas
    // Como Promise.all hace 5 llamadas, fetch debe responder algo válido siempre
    const mockApiRecord = {
      date: "2023",
      value: 19000000,
      countryiso3code: "CHL",
      country: { id: "CL", value: "Chile" },
    };

    const mockApiResponse = [
      { page: 1, total: 1 },
      [mockApiRecord, { date: "2022", value: null }],
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    // --- ACT ---
    const result = await service.getPopulationByCountry("CL");

    // --- ASSERT ---
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Chile");
    // Verificamos que traiga datos
    expect(result?.totalPopulation.value).toBe(19000000);

    // IMPORTANTE: Ahora esperamos 5 llamadas (Pop, Life, Grow, Male, Female)
    expect(global.fetch).toHaveBeenCalledTimes(5);
  });

  it("Debería retornar NULL si la API no tiene datos válidos", async () => {
    (PopulationModel.findOne as jest.Mock).mockResolvedValue(null);

    const mockEmptyResponse = [
      { page: 1 },
      [], // Array vacío
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

  it("Debería retornar datos de MONGODB si ya existen en caché (sin llamar a fetch)", async () => {
    // Simulamos que SI encuentra datos en Mongo con la ESTRUCTURA NUEVA
    (PopulationModel.findOne as jest.Mock).mockResolvedValue({
      id: "CL",
      searchName: "CL",
      name: "Chile Cacheado",
      countryiso3code: "CHL",
      totalPopulation: { date: "2023", value: 500 },
      lifeExpectance: { date: "2023", value: 80 },
      populationGrowth: { date: "2023", value: 1.5 },
      male: { date: "2023", value: 250 },
      female: { date: "2023", value: 250 },
    });

    const result = await service.getPopulationByCountry("CL");

    expect(result?.name).toBe("Chile Cacheado");
    expect(result?.totalPopulation.value).toBe(500);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
