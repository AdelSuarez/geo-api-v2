import { City } from "./geoNames/geonames.interface";

interface Bounding {
  east: number;
  south: number;
  north: number;
  west: number;
  accuracyLevel: number;
}

interface TimeZone {
  gmtOffset: number;
  timeZoneId: string;
  dstOffset: number;
}

export interface GeoCity {
  id: string;
  name: string;
  longitude: string;
  latitude: string;
  //   lo coloco opcional ya que me genero un error el time porque el pais que busque no lo tenia, o estaba con una estructura diferente
  //   ! corregir lo de la hora, con Mexico
  bounding?: Bounding;
  timezone?: TimeZone;
}

export function getGeoCity(city: City): GeoCity {
  return {
    id: city.countryId,
    name: city.name,
    longitude: city.lng,
    latitude: city.lat,
    bounding: city.bbox
      ? {
          east: city.bbox.east,
          south: city.bbox.south,
          north: city.bbox.north,
          west: city.bbox.west,
          accuracyLevel: city.bbox.accuracyLevel,
        }
      : undefined,
    timezone: city.timezone
      ? {
          gmtOffset: city.timezone.gmtOffset,
          timeZoneId: city.timezone.timeZoneId,
          dstOffset: city.timezone.dstOffset,
        }
      : undefined,
  };
}
