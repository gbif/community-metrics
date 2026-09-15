// API for taxonomic diversity chart data
import { TaxonomicDiversityData } from './types';

/**
 * Get taxonomic diversity data for a specific country
 * @param countryCode - Two-letter country code (e.g., 'AU', 'BW')
 * @returns Taxonomic diversity data or null if not found
 */
export const getTaxonomicDiversityData = async (countryCode: string): Promise<TaxonomicDiversityData | null> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/taxonomic-diversity/${countryCode.toUpperCase()}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch taxonomic diversity data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform backend data to match frontend type
    return {
      countryCode: data.countryCode,
      countryName: data.countryName,
      totalSpecies: data.totalSpecies,
      groups: data.groups.map((group: any) => ({
        name: group.name,
        species: group.species,
        percentage: group.percentage,
        kingdom: group.kingdom,
      })),
      kingdomSummaries: data.kingdomSummaries?.map((ks: any) => ({
        kingdom: ks.kingdom,
        species: ks.species,
        percentage: ks.percentage,
      })) || [],
      taxonomicRanks: data.taxonomicRanks ? {
        uniqueGenera: data.taxonomicRanks.uniqueGenera,
        uniqueFamilies: data.taxonomicRanks.uniqueFamilies,
        uniqueOrders: data.taxonomicRanks.uniqueOrders,
        uniqueClasses: data.taxonomicRanks.uniqueClasses,
        uniquePhyla: data.taxonomicRanks.uniquePhyla,
        uniqueKingdoms: data.taxonomicRanks.uniqueKingdoms,
      } : undefined,
    };
  } catch (error) {
    console.error('Error fetching taxonomic diversity data:', error);
    return null;
  }
};

/**
 * Get all available countries with taxonomic diversity data
 * Note: With static architecture, this would need to read from an index.json file
 * @returns Array of country codes
 */
export const getAvailableTaxonomicCountries = async (): Promise<string[]> => {
  // TODO: Implement by reading from /data/index.json if needed
  console.warn('getAvailableTaxonomicCountries not implemented for static architecture');
  return [];
  
  /* Old backend implementation:
  try {
    const response = await fetch(`/api/taxonomic-diversity/available-countries`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch available countries: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching available countries:', error);
    return [];
  }
  */
};

/**
 * Validate taxonomic diversity data consistency
 * @param data - Taxonomic diversity data to validate
 * @returns Validation result with any issues found
 */
export const validateTaxonomicData = (data: TaxonomicDiversityData): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  
  // Check if percentages add up to approximately 100%
  const totalPercentage = data.groups.reduce((sum, group) => sum + group.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.1) {
    issues.push(`Percentages sum to ${totalPercentage}% instead of 100%`);
  }
  
  // Check if species counts match total
  const totalSpeciesCount = data.groups.reduce((sum, group) => sum + group.species, 0);
  if (totalSpeciesCount !== data.totalSpecies) {
    issues.push(`Species counts sum to ${totalSpeciesCount} but totalSpecies is ${data.totalSpecies}`);
  }
  
  // Check for duplicate group names
  const groupNames = data.groups.map(g => g.name.toLowerCase());
  const uniqueNames = new Set(groupNames);
  if (uniqueNames.size !== groupNames.length) {
    issues.push('Duplicate group names found');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// Export types for convenience
export type { TaxonomicDiversityData, TaxonomicGroup } from './types';
