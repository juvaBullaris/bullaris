/**
 * Danish municipality tax rates for 2024.
 * Source: KL (Kommunernes Landsforening) 2024
 * These are the kommunale skatteprocenter (excluding church tax).
 */

export interface MunicipalityRate {
  name: string
  code: string
  rate: number
}

export const MUNICIPALITY_RATES_2024: MunicipalityRate[] = [
  { name: 'Aabenraa', code: '580', rate: 0.2431 },
  { name: 'Aalborg', code: '851', rate: 0.2525 },
  { name: 'Aarhus', code: '751', rate: 0.2474 },
  { name: 'Albertslund', code: '165', rate: 0.2465 },
  { name: 'Allerød', code: '201', rate: 0.2360 },
  { name: 'Assens', code: '420', rate: 0.2543 },
  { name: 'Ballerup', code: '151', rate: 0.2550 },
  { name: 'Billund', code: '530', rate: 0.2575 },
  { name: 'Bornholm', code: '400', rate: 0.2700 },
  { name: 'Brøndby', code: '153', rate: 0.2540 },
  { name: 'Brønderslev', code: '810', rate: 0.2562 },
  { name: 'Dragør', code: '155', rate: 0.2396 },
  { name: 'Egedal', code: '240', rate: 0.2550 },
  { name: 'Esbjerg', code: '561', rate: 0.2578 },
  { name: 'Fanø', code: '563', rate: 0.2408 },
  { name: 'Favrskov', code: '710', rate: 0.2562 },
  { name: 'Faxe', code: '320', rate: 0.2524 },
  { name: 'Fredensborg', code: '210', rate: 0.2544 },
  { name: 'Fredericia', code: '607', rate: 0.2552 },
  { name: 'Frederiksberg', code: '147', rate: 0.2352 },
  { name: 'Frederikshavn', code: '813', rate: 0.2568 },
  { name: 'Frederikssund', code: '250', rate: 0.2563 },
  { name: 'Furesø', code: '190', rate: 0.2476 },
  { name: 'Faaborg-Midtfyn', code: '430', rate: 0.2565 },
  { name: 'Gentofte', code: '157', rate: 0.2295 },
  { name: 'Gladsaxe', code: '159', rate: 0.2445 },
  { name: 'Glostrup', code: '161', rate: 0.2350 },
  { name: 'Greve', code: '253', rate: 0.2460 },
  { name: 'Gribskov', code: '270', rate: 0.2550 },
  { name: 'Guldborgsund', code: '376', rate: 0.2570 },
  { name: 'Haderslev', code: '510', rate: 0.2528 },
  { name: 'Halsnæs', code: '260', rate: 0.2575 },
  { name: 'Hedensted', code: '766', rate: 0.2582 },
  { name: 'Helsingør', code: '217', rate: 0.2558 },
  { name: 'Herlev', code: '163', rate: 0.2560 },
  { name: 'Herning', code: '657', rate: 0.2543 },
  { name: 'Hillerød', code: '219', rate: 0.2553 },
  { name: 'Hjørring', code: '860', rate: 0.2575 },
  { name: 'Holbæk', code: '316', rate: 0.2570 },
  { name: 'Holstebro', code: '661', rate: 0.2571 },
  { name: 'Horsens', code: '615', rate: 0.2556 },
  { name: 'Hvidovre', code: '167', rate: 0.2580 },
  { name: 'Høje-Taastrup', code: '169', rate: 0.2558 },
  { name: 'Hørsholm', code: '223', rate: 0.2290 },
  { name: 'Ikast-Brande', code: '756', rate: 0.2562 },
  { name: 'Ishøj', code: '183', rate: 0.2580 },
  { name: 'Jammerbugt', code: '849', rate: 0.2582 },
  { name: 'Kalundborg', code: '326', rate: 0.2550 },
  { name: 'Kerteminde', code: '440', rate: 0.2480 },
  { name: 'Kolding', code: '621', rate: 0.2552 },
  { name: 'København', code: '101', rate: 0.2360 },
  { name: 'Køge', code: '259', rate: 0.2540 },
  { name: 'Langeland', code: '482', rate: 0.2612 },
  { name: 'Lejre', code: '350', rate: 0.2578 },
  { name: 'Lemvig', code: '665', rate: 0.2580 },
  { name: 'Lolland', code: '360', rate: 0.2620 },
  { name: 'Lyngby-Taarbæk', code: '173', rate: 0.2338 },
  { name: 'Læsø', code: '825', rate: 0.2620 },
  { name: 'Mariagerfjord', code: '846', rate: 0.2574 },
  { name: 'Middelfart', code: '410', rate: 0.2558 },
  { name: 'Morsø', code: '773', rate: 0.2620 },
  { name: 'Norddjurs', code: '707', rate: 0.2575 },
  { name: 'Nordfyns', code: '480', rate: 0.2558 },
  { name: 'Nyborg', code: '450', rate: 0.2538 },
  { name: 'Næstved', code: '370', rate: 0.2550 },
  { name: 'Odder', code: '727', rate: 0.2555 },
  { name: 'Odense', code: '461', rate: 0.2511 },
  { name: 'Odsherred', code: '306', rate: 0.2584 },
  { name: 'Randers', code: '730', rate: 0.2558 },
  { name: 'Rebild', code: '840', rate: 0.2567 },
  { name: 'Ringkøbing-Skjern', code: '760', rate: 0.2550 },
  { name: 'Ringsted', code: '329', rate: 0.2538 },
  { name: 'Roskilde', code: '265', rate: 0.2541 },
  { name: 'Rudersdal', code: '230', rate: 0.2285 },
  { name: 'Rødovre', code: '175', rate: 0.2580 },
  { name: 'Samsø', code: '741', rate: 0.2580 },
  { name: 'Silkeborg', code: '740', rate: 0.2540 },
  { name: 'Skanderborg', code: '746', rate: 0.2540 },
  { name: 'Skive', code: '779', rate: 0.2567 },
  { name: 'Slagelse', code: '330', rate: 0.2560 },
  { name: 'Solrød', code: '269', rate: 0.2438 },
  { name: 'Sorø', code: '340', rate: 0.2558 },
  { name: 'Stevns', code: '336', rate: 0.2558 },
  { name: 'Struer', code: '671', rate: 0.2578 },
  { name: 'Svendborg', code: '479', rate: 0.2556 },
  { name: 'Syddjurs', code: '706', rate: 0.2575 },
  { name: 'Sønderborg', code: '540', rate: 0.2513 },
  { name: 'Thisted', code: '787', rate: 0.2577 },
  { name: 'Tønder', code: '550', rate: 0.2549 },
  { name: 'Tårnby', code: '185', rate: 0.2380 },
  { name: 'Vallensbæk', code: '187', rate: 0.2365 },
  { name: 'Varde', code: '573', rate: 0.2561 },
  { name: 'Vejen', code: '575', rate: 0.2555 },
  { name: 'Vejle', code: '630', rate: 0.2556 },
  { name: 'Vesthimmerlands', code: '820', rate: 0.2582 },
  { name: 'Viborg', code: '791', rate: 0.2555 },
  { name: 'Vordingborg', code: '390', rate: 0.2562 },
  { name: 'Ærø', code: '492', rate: 0.2600 },
]

/**
 * Look up municipality tax rate by name.
 * Falls back to national average if municipality not found.
 */
export function getMunicipalityRate(municipalityName: string): number {
  const DEFAULT_RATE = 0.25018 // National average 2024

  if (!municipalityName) return DEFAULT_RATE

  const normalised = municipalityName.trim().toLowerCase()
  const found = MUNICIPALITY_RATES_2024.find(
    (m) => m.name.toLowerCase() === normalised
  )

  return found?.rate ?? DEFAULT_RATE
}
