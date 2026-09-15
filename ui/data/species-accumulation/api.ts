import type { CountryAccumulationData, TaxonomicGroupAccumulation, GBIFCountry } from './types';

const GBIF_COUNTRIES_URL = 'https://api.gbif.org/v1/enumeration/country';

// Color mapping for taxonomic groups (moved from backend to frontend)
const TAXONOMIC_GROUP_COLORS: Record<string, string> = {
  'Amphibians': '#4C9B45',
  'Arachnids': '#0079B5',
  'Basidiomycota': '#684393',
  'Birds': '#0079B5',
  'Bonyfish': '#20B4E9',
  'Ferns': '#8BC34A',
  'Floweringplants': '#4C9B45',
  'Gymnosperms': '#2E7D32',
  'Insects': '#E27B72',
  'Mammals': '#F0BE48',
  'Molluscs': '#D0628D',
  'Mosses': '#20B4E9',
  'Other': '#9E9E9E',
  'Reptiles': '#684393',
  'Sacfungi': '#9C27B0',
};

// In-memory cache for accumulation data
const cache = new Map<string, CountryAccumulationData>();

/**
 * Get species accumulation data for a specific country
 */
export const getAccumulationData = async (countryCode: string): Promise<CountryAccumulationData | null> => {
  // Check cache first
  if (cache.has(countryCode)) {
    return cache.get(countryCode)!;
  }

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/species-accumulation/${countryCode}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch accumulation data: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data) {
      return null;
    }

    // Add colors to taxonomic groups
    const dataWithColors: CountryAccumulationData = {
      ...data,
      taxonomicGroups: data.taxonomicGroups.map((group: Omit<TaxonomicGroupAccumulation, 'color'>) => ({
        ...group,
        color: TAXONOMIC_GROUP_COLORS[group.group] || TAXONOMIC_GROUP_COLORS['Other'],
      })),
    };

    // Cache the result
    cache.set(countryCode, dataWithColors);
    
    return dataWithColors;
  } catch (error) {
    console.error(`Error fetching accumulation data for ${countryCode}:`, error);
    return null;
  }
};

/**
 * Get all available country codes with accumulation data
 * Note: With static architecture, this would need to read from an index.json file
 */
export const getAvailableCountries = async (): Promise<string[]> => {
  // TODO: Implement by reading from /data/index.json if needed
  console.warn('getAvailableCountries not implemented for static architecture');
  return [];
  
  /* Old backend implementation:
  try {
    const response = await fetch('/api/species-accumulation');
    if (!response.ok) {
      throw new Error(`Failed to fetch available countries: ${response.statusText}`);
    }
    const data: CountryAccumulationData[] = await response.json();
    return data.map(country => country.countryCode);
  } catch (error) {
    console.error('Error fetching available countries:', error);
    return [];
  }
  */
};

/**
 * Get taxonomic groups for a specific country
 */
export const getTaxonomicGroups = async (countryCode: string): Promise<string[]> => {
  const data = await getAccumulationData(countryCode);
  return data ? data.taxonomicGroups.map(group => group.group) : [];
};

/**
 * Get accumulation data for a specific taxonomic group in a country
 */
export const getGroupAccumulationData = async (countryCode: string, groupName: string): Promise<TaxonomicGroupAccumulation | null> => {
  const data = await getAccumulationData(countryCode);
  if (!data) return null;
  
  return data.taxonomicGroups.find(group => group.group === groupName) || null;
};

/**
 * Get all countries from GBIF enumeration
 */
export const getGBIFCountries = async (): Promise<GBIFCountry[]> => {
  try {
    const response = await fetch(GBIF_COUNTRIES_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch GBIF countries: ${response.statusText}`);
    }
    const data: GBIFCountry[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GBIF countries:', error);
    return [];
  }
};