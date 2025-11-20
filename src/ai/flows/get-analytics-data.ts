'use server';
/**
 * @fileOverview A Genkit flow to fetch Google Analytics data.
 *
 * - getAnalyticsData - A function that fetches key metrics from the GA4 Data API.
 * - AnalyticsDataOutput - The return type for the getAnalyticsData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { format } from 'date-fns';

const AnalyticsDataOutputSchema = z.object({
  stats: z.object({
    totalUsers: z.string(),
    pageViews: z.string(),
    bounceRate: z.string(),
    averageSessionDuration: z.string(),
  }),
  monthlyVisitors: z.array(z.object({
    month: z.string(),
    visitors: z.number(),
  })),
  trafficSources: z.array(z.object({
    source: z.string(),
    visitors: z.number(),
  })),
});

export type AnalyticsDataOutput = z.infer<typeof AnalyticsDataOutputSchema>;

export async function getAnalyticsData(): Promise<AnalyticsDataOutput> {
  return getAnalyticsDataFlow();
}

const getAnalyticsDataFlow = ai.defineFlow(
  {
    name: 'getAnalyticsDataFlow',
    inputSchema: z.void(),
    outputSchema: AnalyticsDataOutputSchema,
  },
  async () => {
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      throw new Error('La variable de entorno GA4_PROPERTY_ID no está configurada.');
    }
    if (propertyId.startsWith('G-')) {
        throw new Error(
            'ID de Propiedad Inválido. Estás usando un ID de Medición (G-...). Debes usar el ID de Propiedad numérico. Encuéntralo en GA > Administrar > Configuración de la propiedad.'
        );
    }

    const credentialsString = process.env.GOOGLE_ANALYTICS_CREDENTIALS;
    if (!credentialsString) {
      throw new Error('La variable de entorno GOOGLE_ANALYTICS_CREDENTIALS no está configurada.');
    }
    
    let credentials;
    try {
        credentials = JSON.parse(credentialsString);
    } catch (e) {
        throw new Error('Error al parsear GOOGLE_ANALYTICS_CREDENTIALS. Asegúrate de que es un string JSON válido.');
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

    try {
        // Helper function to format metric values
        const formatMetric = (value: string | undefined) => value || '0';

        // 1. Fetch KPI Metrics
        const [kpiResponse] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
        metrics: [
            { name: 'totalUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
        ],
        });

        const kpiRow = kpiResponse.rows?.[0]?.metricValues;
        const totalUsers = formatMetric(kpiRow?.[0]?.value);
        const pageViews = formatMetric(kpiRow?.[1]?.value);
        const bounceRate = parseFloat(formatMetric(kpiRow?.[2]?.value)) * 100;
        const avgSession = parseFloat(formatMetric(kpiRow?.[3]?.value));

        // 2. Fetch Monthly Visitors for the last 6 months
        const [monthlyResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '180daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'year' }, { name: 'month' }],
            metrics: [{ name: 'totalUsers' }],
            orderBys: [{ dimension: { orderType: 'NUMERIC', dimensionName: 'year' } }, { dimension: { orderType: 'NUMERIC', dimensionName: 'month' } }]
        });

        const monthlyVisitors = monthlyResponse.rows?.map(row => {
            const year = row.dimensionValues?.[0].value || 'N/A';
            const monthNum = parseInt(row.dimensionValues?.[1].value || '1', 10);
            const date = new Date(Number(year), monthNum - 1, 1);
            return {
                month: format(date, 'MMM'),
                visitors: parseInt(formatMetric(row.metricValues?.[0]?.value), 10),
            };
        }) || [];
        
        // 3. Fetch Traffic Sources
        const [sourcesResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'sessionSource' }],
            metrics: [{ name: 'totalUsers' }],
            orderBys: [{ metric: { orderType: 'NUMERIC', metricName: 'totalUsers' }, desc: true }],
            limit: 5,
        });
        
        const trafficSources = sourcesResponse.rows?.map(row => ({
            source: row.dimensionValues?.[0].value || 'Unknown',
            visitors: parseInt(formatMetric(row.metricValues?.[0]?.value), 10),
        })) || [];


        return {
        stats: {
            totalUsers,
            pageViews,
            bounceRate: `${bounceRate.toFixed(1)}%`,
            averageSessionDuration: `${avgSession.toFixed(2)}s`,
        },
        monthlyVisitors,
        trafficSources
        };
    } catch (err: any) {
        if (err.message?.includes('INVALID_ARGUMENT')) {
            throw new Error(`Error de la API de Google Analytics: ${err.message}. Asegúrate de que el ID de Propiedad '${propertyId}' es correcto y que la cuenta de servicio tiene permisos.`);
        }
        throw err;
    }
  }
);
