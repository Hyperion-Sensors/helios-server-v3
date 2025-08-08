import {Prisma, PrismaClient} from '@prisma/client';
import {prisma as prismaClient} from '../lib/prisma';

export type SensorDataInsert = {
  id?: number; // optional depending on schema
  settings_id: number;
  time: Date;
  frequency_mhz: number[];
  temp_celcius: number[];
  strain: number[];
};

export type SensorSettingsInsert = {
  id: number;
  settings: number;
  time: Date;
};

// Whitelist mapping from external keys to concrete table names
// Populate with the allowed sensor tables. This prevents arbitrary SQL identifier injection.
const allowedSensorTables: Record<string, string> = {};

export function registerAllowedSensorTable(key: string, tableName: string) {
  allowedSensorTables[key] = tableName;
}

function getValidatedTableIdentifier(tableKeyOrName: string): Prisma.Sql {
  const tableName = allowedSensorTables[tableKeyOrName] ?? tableKeyOrName;
  // Only allow [a-zA-Z0-9_], reject others
  if (!/^[A-Za-z0-9_]+$/.test(tableName)) {
    throw new Error('Invalid table identifier');
  }
  // Quote as identifier safely
  return Prisma.sql([`"${tableName}"`]);
}

export class RealTimeRepository {
  private prisma: PrismaClient;
  constructor(client: PrismaClient = prismaClient) {
    this.prisma = client;
  }

  async getLatestTime(tableKeyOrName: string): Promise<Date | null> {
    const tableIdent = getValidatedTableIdentifier(tableKeyOrName);
    const query = Prisma.sql`SELECT time FROM ${tableIdent} ORDER BY id DESC LIMIT 1`;
    const result: Array<{time: Date}> = await this.prisma.$queryRaw(query);
    return result?.[0]?.time ?? null;
  }

  async insertSensorData(tableKeyOrName: string, payload: SensorDataInsert) {
    const tableIdent = getValidatedTableIdentifier(tableKeyOrName);
    const {id, settings_id, time, frequency_mhz, temp_celcius, strain} = payload;
    const idPart = typeof id === 'number' ? Prisma.sql`, id` : Prisma.empty;
    const idValues = typeof id === 'number' ? Prisma.sql`, ${id}` : Prisma.empty;

    const query = Prisma.sql`
      INSERT INTO ${tableIdent} (settings_id, time, frequency_mhz, temp_celcius, strain${idPart})
      VALUES (${settings_id}, ${time}, ${frequency_mhz}, ${temp_celcius}, ${strain}${idValues})
      ON CONFLICT DO NOTHING
      RETURNING *;
    `;
    return this.prisma.$queryRaw(query);
  }

  async insertSensorSettings(tableKeyOrName: string, payload: SensorSettingsInsert) {
    const tableIdent = getValidatedTableIdentifier(tableKeyOrName);
    const {id, settings, time} = payload;
    const query = Prisma.sql`
      INSERT INTO ${tableIdent} (id, settings, time)
      VALUES (${id}, ${settings}, ${time})
      ON CONFLICT DO NOTHING
      RETURNING *;
    `;
    return this.prisma.$queryRaw(query);
  }
}


