import { IDatabaseDriver, IQuery } from '@chego/chego-api';
import { execute } from './executor';
import { Pool, PoolClient } from 'pg'

export const chegoPostgres = (): IDatabaseDriver => {
    let initialized: boolean = false;
    let pool: Pool;
    let client:PoolClient;

    const driver = {
        initialize(config: any): IDatabaseDriver {
            pool = new Pool(config);
            initialized = true;
            return driver;
        },
        execute: async (queries: IQuery[]): Promise<any> => new Promise((resolve, reject) => {
            if (!initialized) {
                throw new Error('Driver not initialized');
            }
            return execute(client, queries).then(resolve).catch(reject);
        }),
        connect: (): Promise<any> => pool.connect().then((poolClient:PoolClient) => {
            client = poolClient;
        }),
        disconnect: (): Promise<any> => pool.end()
    }
    return driver;
}