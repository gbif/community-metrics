// API for species occurrence table data
import { SpeciesOccurrenceTableData } from './types';

/**
 * Get species occurrence table data for a specific country
 * @param countryCode - Two-letter country code (e.g., 'AU', 'BW', 'DK')
 * @param publishedBy - Whether to get records published by the country (true) or from the country (false)
 * @returns Species occurrence table data or null if not found
 */
export const getSpeciesOccurrenceTableData = async (
  countryCode: string, 
  publishedBy: boolean = false
): Promise<SpeciesOccurrenceTableData | null> => {
  try {
    const suffix = publishedBy ? 'published' : 'from';
    const response = await fetch(`${import.meta.env.BASE_URL}data/species-occurrence-table/${countryCode.toUpperCase()}-${suffix}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`No species occurrence table data found for country: ${countryCode} (publishedBy: ${publishedBy})`);
        return null;
      }
      throw new Error(`Failed to fetch species occurrence table data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform backend data to match frontend type
    return {
      countryCode: data.countryCode,
      countryName: data.countryName,
      publishedBy: data.publishedBy,
      taxonomicGroups: data.taxonomicGroups.map((group: any) => ({
        group: group.group,
        occurrences: group.occurrences,
        species: group.species,
        occurrenceGrowth: group.occurrenceGrowth,
        speciesGrowth: group.speciesGrowth,
      })),
      downloadAttributions: data.downloadAttributions,
    };
  } catch (error) {
    console.error('Error fetching species occurrence table data:', error);
    return null;
  }
};

/**
 * Get all available countries with species occurrence table data
 * Note: With static architecture, this would need to read from an index.json file
 * @returns Array of country codes
 */
export const getAvailableCountries = async (): Promise<string[]> => {
  // TODO: Implement by reading from /data/index.json if needed
  console.warn('getAvailableCountries not implemented for static architecture');
  return [];
  
  /* Old backend implementation:
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch available countries: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.map((item: any) => item.countryCode);
  } catch (error) {
    console.error('Error fetching available countries:', error);
    return [];
  }
  */
};
