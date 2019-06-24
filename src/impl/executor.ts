import { PoolClient } from 'pg';
import { AnyButFunction, IQueryResult } from '@chego/chego-api';
import { IQueryScheme, IQuerySchemeArray, IQuery, IQuerySchemeElement } from '@chego/chego-api';
import { isQueryScheme } from '@chego/chego-tools';
import { newQueryBuilder } from './queryBuilder';
import { IQueryBuilder } from '../api/interfaces';

const parseSchemeToQueryString = (scheme: IQueryScheme): string => {
    const schemeArr: IQuerySchemeArray = scheme.toArray();
    const queryBuilder: IQueryBuilder = newQueryBuilder();

    schemeArr.forEach((element: IQuerySchemeElement) => {
        queryBuilder.with(element.type,
            isQueryScheme(element.params[0])
                ? [`(${parseSchemeToQueryString(element.params[0])})`]
                : element.params);
    });
    return queryBuilder.build();
}

const queryResult = (): IQueryResult => {
    let result: AnyButFunction;
    return {
        setData: (value: AnyButFunction): void => {
            result = value;
        },
        getData: (): AnyButFunction => result
    }
}

const beginTransaction = (client: PoolClient, queries: IQuery[]) =>
    new Promise(async (resolve, reject) => {
        try {
            const result: IQueryResult = queryResult();
            await client.query('BEGIN');
            for (const query of queries) {
                const sql: string = parseSchemeToQueryString(query.scheme);
                await client.query(sql, (error: Error, result: any) => {
                    if(!error) {
                        result.setData(result);
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

const executeQuery = (client: PoolClient, query: IQuery) =>
    new Promise((resolve, reject) => {
        const sql: string = parseSchemeToQueryString(query.scheme);
        console.log('SQL', sql)
        client.query(sql, (error: Error, result: any) => {
            client.release();
            return (error) ? reject(error) : resolve(result)
        });
    });

export const execute = (client: PoolClient, queries: IQuery[]) => new Promise((resolve, reject) =>
    ((queries.length > 1)
        ? beginTransaction(client, queries)
        : executeQuery(client, queries[0]))
        .then(resolve)
        .catch(reject));
