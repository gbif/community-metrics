import type { OccurrenceTimeSeriesData } from './types';

export async function getOccurrenceTimeSeries(
  countryCode: string, 
  dataType: 'COUNTRY' | 'PUBLISHER' = 'COUNTRY'
): Promise<OccurrenceTimeSeriesData | null> {
  try {
    console.log(`[API] Fetching occurrence time series for ${countryCode} with dataType=${dataType}`);
    const suffix = dataType === 'PUBLISHER' ? '-publisher' : '';
    const response = await fetch(`${import.meta.env.BASE_URL}data/occurrence-time-series/${countryCode}${suffix}.json`);
    console.log(`[API] Response status: ${response.status}, ok: ${response.ok}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch occurrence time series data for ${countryCode}`);
    }
    
    // Check if response has content
    const text = await response.text();
    console.log(`[API] Response text length: ${text.length}`);
    
    if (!text || text.trim() === '') {
      console.log(`[API] Empty response for ${countryCode}`);
      return null;
    }
    
    const data = JSON.parse(text);
    console.log(`[API] Successfully parsed data for ${countryCode}, groups: ${data?.taxonomicGroups?.length}`);
    return data;
  } catch (error) {
    console.error('[API] Error fetching occurrence time series:', error);
    return null;
  }
}
