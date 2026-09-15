// Images from data/images folder (using 2-letter country codes)
const image_7939edfec694d8328b1c52b88c2e0562f61fb835 = `${import.meta.env.BASE_URL}data/images/species-accumulation/BW-accumulation.png`;
const image_0b3ff0d2596d1053d3859a50cdaab2ed44428b71 = `${import.meta.env.BASE_URL}data/images/species-richness/BW-species-richness.png`;
const image_1733de95b04e2a57294a1506cc4e7fe0e5eabf0e = `${import.meta.env.BASE_URL}data/images/chao1/BW-chao1.png`;
// Country data API - loads data from JSON files
// This simulates an API endpoint that you can easily modify by editing the JSON files

// Import country data files
import { countryData as australiaData } from './countries/AU';
import { countryData as botswanaData } from './countries/BW';
import { countryData as denmarkData } from './countries/DK';
import { countryData as colombiaData } from './countries/CO';

// Images from data/images folder for countries with available assets (using 2-letter country codes)
const image_18d645e7f1bff2b60e0255aad48038c90765b0ad = `${import.meta.env.BASE_URL}data/images/species-accumulation/AU-accumulation.png?v=` + Date.now();
const image_9a043df07abe015f495e424aac91e01fd5704c62 = `${import.meta.env.BASE_URL}data/images/chao1/AU-chao1.png?v=` + Date.now();
const image_642c8876bc4ea5b283e242b29883cc39f7b92f88 = `${import.meta.env.BASE_URL}data/images/species-richness/AU-species-richness.png?v=` + Date.now();
const denmarkSpeciesRichness = `${import.meta.env.BASE_URL}data/images/species-richness/DK-species-richness.png?v=` + Date.now();
const denmarkChao1 = `${import.meta.env.BASE_URL}data/images/chao1/DK-chao1.png?v=` + Date.now();
const denmarkAccumulation = `${import.meta.env.BASE_URL}data/images/species-accumulation/DK-accumulation.png`;
const colombiaSpeciesRichness = `${import.meta.env.BASE_URL}data/images/species-richness/CO-species-richness.png?v=` + Date.now();
const colombiaChao1 = `${import.meta.env.BASE_URL}data/images/chao1/CO-chao1.png?v=` + Date.now();
const colombiaAccumulation = `${import.meta.env.BASE_URL}data/images/species-accumulation/CO-accumulation.png`;

export interface TaxonomicGroup {
  group: string;
  occurrences: number;
  species: number;
  occurrenceGrowth: string;
  speciesGrowth: string;
  color: string;
  kingdom?: string;
}

// Simple taxonomic group for sunburst visualization (no occurrence/growth data)
export interface SimpleTaxonomicGroup {
  group: string;
  species: number;
  percentage: number;
  color: string;
  kingdom?: string;
}

export interface KingdomSummary {
  kingdom: string;
  species: number;
  percentage: number;
}

export interface TaxonomicCoverage {
  countryCode: string;
  countryName: string;
  taxonomicCoverage: {
    distinctKingdoms: number;
    distinctPhyla: number;
    distinctClasses: number;
    distinctOrders: number;
    distinctFamilies: number;
    distinctGenera: number;
    distinctSpecies: number;
    totalOccurrences: number;
    occurrencesWithClass: number;
    occurrencesWithOrder: number;
    occurrencesWithFamily: number;
    occurrencesWithGenus: number;
    areaKm2?: number;
    speciesPerThousandKm2?: number;
    classesPerThousandKm2?: number;
    ordersPerThousandKm2?: number;
    familiesPerThousandKm2?: number;
  };
}

export interface TemporalCoverage {
  countryCode: string;
  countryName: string;
  temporalCoverage: {
    totalSpecies: number;
    singleYearSpecies: number;
    multiYearSpecies: number;
    recentSpecies: number;
    percentageSingleYear: number;
    percentageMultiYear: number;
    percentageRecent: number;
    averageYearRange: number;
    medianYearRange: number;
    yearRangeDistribution: {
      singleYear: number;
      oneToFiveYears: number;
      sixToTenYears: number;
      elevenToTwentyYears: number;
      overTwentyYears: number;
    };
  };
}

export interface GeographicCoverage {
  countryCode: string;
  countryName: string;
  geographicCoverage: {
    resolution: number;
    areaKm2: number;
    theoreticalMaxGridCells: number;
    totalGridCells: number;
    coveragePercentage: number;
    totalOccurrences: number;
    totalDistinctSpeciesAcrossGrids: number;
    meanSpeciesPerGrid: number;
    medianSpeciesPerGrid: number;
    maxSpeciesPerGrid: number;
    gridsWithAtLeast1Species: number;
    gridsWithAtLeast10Species: number;
    gridsWithAtLeast50Species: number;
    gridsWithAtLeast100Species: number;
    gridsWithAtLeast200Species: number;
    gridsWithAtLeast500Species: number;
    meanClassesPerGrid: number;
    medianClassesPerGrid: number;
    maxClassesPerGrid: number;
    gridsWithAtLeast5Classes: number;
    gridsWithAtLeast10Classes: number;
    gridsWithAtLeast20Classes: number;
    gridsWithAtLeast30Classes: number;
    meanOrdersPerGrid: number;
    medianOrdersPerGrid: number;
    maxOrdersPerGrid: number;
    gridsWithAtLeast10Orders: number;
    gridsWithAtLeast50Orders: number;
    gridsWithAtLeast100Orders: number;
    gridsWithAtLeast150Orders: number;
    meanFamiliesPerGrid: number;
    medianFamiliesPerGrid: number;
    maxFamiliesPerGrid: number;
    gridsWithAtLeast50Families: number;
    gridsWithAtLeast100Families: number;
    gridsWithAtLeast200Families: number;
    gridsWithAtLeast500Families: number;
    meanOccurrencesPerGrid: number;
    gridsWithData: number;
  };
}

export interface TaxonomicBenchmark {
  countryCode: string;
  countryName: string;
  distinctClasses: number;
  distinctOrders: number;
  distinctFamilies: number;
  distinctSpecies: number;
}

export interface TaxonomicBenchmarks {
  smallestPassingAll: TaxonomicBenchmark | null;
  largestFailingAll: TaxonomicBenchmark | null;
  statistics: {
    totalCountries: number;
    countriesPassingAllLevels: number;
    countriesPassingLevel1: number;
    countriesPassingLevel2: number;
    countriesPassingLevel3: number;
  };
  generatedAt: string;
}

export interface CountryData {
  name: string;
  code: string;
  totalOccurrences: string;
  publishedByCountry: string;
  annualGrowth: string;
  datasets: string;
  organizations: string;
  species: string;
  speciesAnnualGrowth: string;
  families: string;
  literatureCount: string;
  literatureTotal: string;
  description: string;
  chartTitle: string;
  taxonomicGroups: TaxonomicGroup[];
  allTaxonomicGroups?: SimpleTaxonomicGroup[];
  kingdomSummaries?: KingdomSummary[];
  taxonomicRanks?: {
    uniqueGenera: number;
    uniqueFamilies: number;
    uniqueOrders: number;
    uniqueClasses: number;
    uniquePhyla: number;
    uniqueKingdoms: number;
  };
  diversityMaps?: {
    speciesRichness: string;
    chao1: string;
  };
  accumulationCurve?: string;
}

// Enhanced country data with image assets
const enhancedCountryData: Record<string, CountryData> = {
  AU: {
    ...australiaData,
    diversityMaps: {
      speciesRichness: image_642c8876bc4ea5b283e242b29883cc39f7b92f88,
      chao1: image_9a043df07abe015f495e424aac91e01fd5704c62
    },
    accumulationCurve: image_18d645e7f1bff2b60e0255aad48038c90765b0ad
  },
  BW: {
    ...botswanaData,
    diversityMaps: {
      speciesRichness: image_0b3ff0d2596d1053d3859a50cdaab2ed44428b71,
      chao1: image_1733de95b04e2a57294a1506cc4e7fe0e5eabf0e
    },
    accumulationCurve: image_7939edfec694d8328b1c52b88c2e0562f61fb835
  },
  DK: {
    ...denmarkData,
    diversityMaps: {
      speciesRichness: denmarkSpeciesRichness,
      chao1: denmarkChao1
    },
    accumulationCurve: denmarkAccumulation
  },
  CO: {
    ...colombiaData,
    diversityMaps: {
      speciesRichness: colombiaSpeciesRichness,
      chao1: colombiaChao1
    },
    accumulationCurve: colombiaAccumulation
  }
};

// Helper function to generate image paths using country codes
export const getCountryImagePath = (countryCode: string, imageType: 'accumulation' | 'chao1' | 'species-richness'): string => {
  const folderMap = {
    'accumulation': 'species-accumulation',
    'chao1': 'chao1',
    'species-richness': 'species-richness'
  };
  return `${import.meta.env.BASE_URL}data/images/${folderMap[imageType]}/${countryCode}-${imageType}.png`;
};

// API function to get country data
export const getCountryData = async (countryCode: string): Promise<CountryData | null> => {
  // Simulate API delay (optional)
  await new Promise(resolve => setTimeout(resolve, 10));
  
  return enhancedCountryData[countryCode] || null;
};

// API function to get all available countries
export const getAvailableCountries = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 10));
  
  return Object.keys(enhancedCountryData);
};

// API function to get taxonomic coverage data
export const getTaxonomicCoverage = async (countryCode: string): Promise<TaxonomicCoverage | null> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/summary-indicator-metrics/taxonomic-coverage/${countryCode}.json`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as TaxonomicCoverage;
  } catch (error) {
    console.error(`Error loading taxonomic coverage for ${countryCode}:`, error);
    return null;
  }
};

// API function to get temporal coverage data
export const getTemporalCoverage = async (countryCode: string): Promise<TemporalCoverage | null> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/summary-indicator-metrics/temporal-coverage/${countryCode}.json`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as TemporalCoverage;
  } catch (error) {
    console.error(`Error loading temporal coverage for ${countryCode}:`, error);
    return null;
  }
};

// API function to get geographic coverage data
export const getGeographicCoverage = async (countryCode: string): Promise<GeographicCoverage | null> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/summary-indicator-metrics/geographic-coverage/${countryCode}.json`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as GeographicCoverage;
  } catch (error) {
    console.error(`Error loading geographic coverage for ${countryCode}:`, error);
    return null;
  }
};

// API function to get taxonomic benchmarks
export const getTaxonomicBenchmarks = async (): Promise<TaxonomicBenchmarks | null> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/summary-indicator-metrics/taxonomic-coverage-benchmarks.json`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as TaxonomicBenchmarks;
  } catch (error) {
    console.error('Error loading taxonomic benchmarks:', error);
    return null;
  }
};

// Export the data for direct access if needed
export { enhancedCountryData };

// Wealth Distribution API

export interface SpeciesOccurrence {
  specieskey: number;
  species: string;
  occurrences: number;
  group: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
}

export interface GroupSummary {
  group: string;
  actualSpeciesCount: number;
  displayedSpeciesCount: number;
  occurrenceCount: number;
  meanOccurrences: number;
  medianOccurrences: number;
  speciesCount?: number; // Deprecated, for backward compatibility
}

export interface WealthDistributionData {
  id: number;
  countryCode: string;
  countryName: string;
  totalSpecies: number;
  totalOccurrences: number;
  lastModified: string;
  dataSource: string;
  species: SpeciesOccurrence[];
  groupSummary: GroupSummary[];
}

export const getWealthDistribution = async (countryCode: string, showPublishedBy: boolean = false): Promise<WealthDistributionData | null> => {
  try {
    const suffix = showPublishedBy ? 'published' : 'from';
    const response = await fetch(`${import.meta.env.BASE_URL}data/wealth-distribution/wealth-distribution-${countryCode}-${suffix}.json`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching wealth distribution data:', error);
    return null;
  }
};