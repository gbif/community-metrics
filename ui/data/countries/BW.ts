// Images from data/images folder for Botswana biodiversity (using 2-letter country code)
// Updated to use SVG files for better display
const speciesRichnessImageBW = `${import.meta.env.BASE_URL}data/images/species-richness/BW-species-richness.svg?v=` + Date.now();
const chao1ImageBW = `${import.meta.env.BASE_URL}data/images/chao1/BW-chao1.svg?v=` + Date.now();
const accumulationCurveImageBW = `${import.meta.env.BASE_URL}data/images/species-accumulation/BW-accumulation.svg?v=` + Date.now();

export const countryData = {
  name: "Botswana",
  code: "BW",
  totalOccurrences: "1.1 M",
  publishedByCountry: "0.8 M published by Botswana",
  datasets: "23",
  organizations: "4 organizations in Botswana",
  species: "8,969",
  families: "1,229 families",
  literatureCount: "100",
  literatureTotal: "445 articles since 2008",
  description:
    "Occurrence record data about Botswana. These can be published by institutions within Botswana or from publishers outside of Botswana.",
  chartTitle: "Botswana Occurrence Records Over Time",
  annualGrowth: "1%",
  speciesAnnualGrowth: "0.7%",
  diversityMaps: {
    speciesRichness: speciesRichnessImageBW,
    chao1: chao1ImageBW
  },
  accumulationCurve: accumulationCurveImageBW,
 taxonomicGroups: [
  {
    group: "Amphibians",
    occurrences: 1706,
    species: 57,
    occurrenceGrowth: "3.14%",
    speciesGrowth: "0%",
    color: "#4C9B45"
  },
  {
    group: "Arachnids",
    occurrences: 2794,
    species: 294,
    occurrenceGrowth: "5.39%",
    speciesGrowth: "0%",
    color: "#0079B5"
  },
  {
    group: "Basidiomycota",
    occurrences: 3410,
    species: 84,
    occurrenceGrowth: "0.15%",
    speciesGrowth: "0%",
    color: "#684393"
  },
  {
    group: "Birds",
    occurrences: 909585,
    species: 684,
    occurrenceGrowth: "0.63%",
    speciesGrowth: "0%",
    color: "#0079B5"
  },
  {
    group: "Ferns",
    occurrences: 223,
    species: 30,
    occurrenceGrowth: "1.36%",
    speciesGrowth: "3.45%",
    color: "#F0BE48"
  },
  {
    group: "Floweringplants",
    occurrences: 65774,
    species: 3068,
    occurrenceGrowth: "2.3%",
    speciesGrowth: "0.36%",
    color: "#4C9B45"
  },
  {
    group: "Insects",
    occurrences: 31053,
    species: 3095,
    occurrenceGrowth: "7.45%",
    speciesGrowth: "1.44%",
    color: "#E27B72"
  },
  {
    group: "Mammals",
    occurrences: 36359,
    species: 233,
    occurrenceGrowth: "4.06%",
    speciesGrowth: "0.43%",
    color: "#F0BE48"
  },
  {
    group: "Molluscs",
    occurrences: 353,
    species: 49,
    occurrenceGrowth: "2.62%",
    speciesGrowth: "0%",
    color: "#D0628D"
  },
  {
    group: "Mosses",
    occurrences: 165,
    species: 41,
    occurrenceGrowth: "0%",
    speciesGrowth: "0%",
    color: "#20B4E9"
  },
  {
    group: "Other",
    occurrences: 19165,
    species: 400,
    occurrenceGrowth: "0.08%",
    speciesGrowth: "0.25%",
    color: "#999999"
  },
  {
    group: "Reptiles",
    occurrences: 8510,
    species: 164,
    occurrenceGrowth: "3.74%",
    speciesGrowth: "0%",
    color: "#684393"
  },
  {
    group: "Sacfungi",
    occurrences: 10793,
    species: 183,
    occurrenceGrowth: "0%",
    speciesGrowth: "0%",
    color: "#4F4C4D"
  }
]
};