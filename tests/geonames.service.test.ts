// import { GeoNameService } from "../src/services/geonames.service";
// import { GEONAMES_USER } from "../src/config/envs";

// // ! verificar el codigo, porque no se entendio bien lo que hace
// describe("Servicio GeoNames", () => {
//   const service = new GeoNameService();

//   it("Debería traer datos completos (lat, lng) de una ciudad", async () => {
//     // 1. Preparamos una respuesta falsa (MOCK) para no usar internet
//     const respuestaFalsa = {
//       geonames: [{ name: "Madrid", lat: "40.4165", lng: "-3.70256" }],
//     };

//     // 2. Trucamos la función "fetch" (el navegador)
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve(respuestaFalsa),
//       })
//     ) as jest.Mock;

//     // 3. Ejecutamos el codigo
//     const resultado = await service.getCityDetails("Madrid");

//     // 4. Verificamos el resultado tiene latitud
//     expect(resultado).toHaveProperty("lat", "40.4165");

//     // Verificamos si se uso el usuario y se pidio info COMPLETA (FULL)?
//     const urlUsada = (global.fetch as jest.Mock).mock.calls[0][0];
//     expect(urlUsada).toContain(`username=${GEONAMES_USER}`);
//     expect(urlUsada).toContain("style=FULL");
//   });
// });

import { GeoNameService } from "../src/services/geonames.service";
import { CityModel } from "../src/models/city.model";

// 1. MOCKEAMOS EL MODELO DE MONGO (¡Esto es lo nuevo!)
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
    // --- PREPARACIÓN (ARRANGE) ---

    // A. Simulamos que la BD está vacía (Cache Miss)
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
    expect(result.name).toBe("Madrid");
    expect(result.lat).toBe("40.4165");

    // Verificamos que intentó buscar en la BD primero
    expect(CityModel.findOne).toHaveBeenCalled();
  });
});
