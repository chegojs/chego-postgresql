import { IDatabaseDriver, IQuery, IQueryResult, Fn } from '@chego/chego-api';
import { Pool, PoolClient } from 'pg'
import { newQueryResult, parseSchemeToSQL, newSqlExecutor, SQLQuery } from '@chego/chego-database-boilerplate';
import { templates } from './templates';

const newTransactionHandle = (client: PoolClient)=>(queries: IQuery[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const result: IQueryResult = newQueryResult();
            await client.query('BEGIN');
            for (const query of queries) {
                const sql: SQLQuery = parseSchemeToSQL(query.scheme, templates);
                await client.query(sql.body, (error: Error, data: any) => {
                    if(!error) {
                        result.setData(data);
                    }
                });
            }
            await client.query('COMMIT');
            client.release();
            return resolve(result.getData());
        } catch (e) {
            await client.query('ROLLBACK');
            client.release();
            return reject(e);
        }
    });

const newQueryHandle = (client: PoolClient)=>(query: IQuery) =>
    new Promise((resolve, reject) => {
        const sql: SQLQuery = parseSchemeToSQL(query.scheme, templates);
        client.query(sql.body, (error: Error, result: any) => {
            client.release();
            return (error) ? reject(error) : resolve(result)
        });
    });
    
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
            const queryHandle: Fn<Promise<any>> = newQueryHandle(client);
            const transactionHandle: Fn<Promise<any>> = newTransactionHandle(client);
            
            return newSqlExecutor()
                .withQueryHandle(queryHandle)
                .withTransactionsHandle(transactionHandle)
                .execute(queries)
                .then(resolve)
                .catch(reject);
        }),
        connect: (): Promise<any> => pool.connect().then((poolClient:PoolClient) => {
            client = poolClient;
        }),
        disconnect: (): Promise<any> => pool.end()
    }
    return driver;
}