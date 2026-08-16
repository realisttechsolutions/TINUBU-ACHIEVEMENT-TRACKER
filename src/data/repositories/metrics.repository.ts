import { getDatabaseConnection } from '@/server/db/pool';

export interface IndicatorMetric {
  id: string;
  slug: string;
  name: string;
  definition: string;
  unit: string;
  frequency: string;
  observations: {
    period: string;
    value: string;
    valueNumeric: number | null;
  }[];
}

export class MetricsRepository {
  static async getIndicators(): Promise<IndicatorMetric[]> {
    const db = await getDatabaseConnection();
    const result = await db.query(
      `SELECT
        indicator->>'indicatorId' AS id,
        indicator->>'slug' AS slug,
        indicator->>'name' AS name,
        indicator->>'definition' AS definition,
        indicator->>'unit' AS unit,
        indicator->>'frequency' AS frequency,
        jsonb_agg(jsonb_build_object(
          'period', indicator->>'reportingPeriodLabel',
          'value', indicator->>'valueDisplay',
          'valueNumeric', indicator->>'valueExact'
        ) ORDER BY indicator->>'periodStart') AS observations
       FROM public_record_catalog record
       CROSS JOIN LATERAL jsonb_array_elements(record.indicators) indicator
       GROUP BY 1, 2, 3, 4, 5, 6
       ORDER BY name`
    );
    return result.rows as unknown as IndicatorMetric[];
  }
}
