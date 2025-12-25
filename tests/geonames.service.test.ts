import { GeoNameService } from "../src/services/geonames.service";
import { GEONAMES_USER } from "../src/config/envs";

// ! verificar el codigo, porque no se entendio bien lo que hace
describe("Servicio GeoNames", () => {
  const service = new GeoNameService();

  it("Debería traer datos completos (lat, lng) de una ciudad", async () => {
    // 1. Preparamos una respuesta falsa (MOCK) para no usar internet
    const respuestaFalsa = {
      geonames: [{ name: "Madrid", lat: "40.4165", lng: "-3.70256" }],
    };

    // 2. Trucamos la función "fetch" (el navegador)
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(respuestaFalsa),
      })
    ) as jest.Mock;

    // 3. Ejecutamos el codigo
    const resultado = await service.getCityDetails("Madrid");

    // 4. Verificamos el resultado tiene latitud
    expect(resultado).toHaveProperty("lat", "40.4165");

    // Verificamos si se uso el usuario y se pidio info COMPLETA (FULL)?
    const urlUsada = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(urlUsada).toContain(`username=${GEONAMES_USER}`);
    expect(urlUsada).toContain("style=FULL");
  });
});
