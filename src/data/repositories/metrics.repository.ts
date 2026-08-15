import { getDatabaseConnection } from '@/lib/firebase/sql-connect/server';

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
    const indRes = await db.query(
      `SELECT id, slug, name, definition, unit, frequency FROM indicators WHERE active = true`
    );

    const metrics: IndicatorMetric[] = [];
    for (const ind of indRes.rows) {
      const obsRes = await db.query(
        `SELECT reporting_period_label as period, value_display as value, value_numeric as "valueNumeric"
         FROM indicator_observations
         WHERE indicator_id = $1
         ORDER BY period_start ASC`,
        [ind.id]
      );
      metrics.push({
        id: ind.id,
        slug: ind.slug,
        name: ind.name,
        definition: ind.definition,
        unit: ind.unit,
        frequency: ind.frequency,
        observations: obsRes.rows,
      });
    }

    return metrics;
  }
}
