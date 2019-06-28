import { QuerySyntaxEnum } from '@chego/chego-api';
import { SQLSyntaxTemplate, SQLSyntaxTemplateData } from '@chego/chego-database-boilerplate'

const select: SQLSyntaxTemplate = () => (...columns: string[]) =>
    `SELECT ${columns.join(', ')}`

const insert: SQLSyntaxTemplate = () => (keys: string[], values: string[]) =>
    `(${keys.join(', ')}) VALUES ${values.join(', ')}`

const to: SQLSyntaxTemplate = () => (table: string) =>
    `INSERT INTO ${table}`

const update: SQLSyntaxTemplate = () => (table: string) =>
    `UPDATE ${table}`;

const set: SQLSyntaxTemplate = () => (properties: any) =>
    `SET ${properties}`;

const remove: SQLSyntaxTemplate = () => () => 'DELETE';

const from: SQLSyntaxTemplate = () => (table: string) =>
    `FROM ${table}`;

const eq: SQLSyntaxTemplate = (data: SQLSyntaxTemplateData) => (value: number | string) =>
    `${data.property} ${data.negation ? '!=' : '='} ${value}`;

const gt: SQLSyntaxTemplate = (data: SQLSyntaxTemplateData) => (value: number | string) =>
    `${data.property} ${data.negation ? '<=' : '>'} ${value}`;

const lt: SQLSyntaxTemplate = (data: SQLSyntaxTemplateData) => (value: number | string) =>
    `${data.property} ${data.negation ? '>=' : '<'} ${value}`;

const isNull: SQLSyntaxTemplate = (data: SQLSyntaxTemplateData) => () =>
    `${data.property} ${data.negation ? 'IS NOT NULL' : 'IS NULL'}`;
const between: SQLSyntaxTemplate = (data: SQLSyntaxTemplateData) => (min: number, max: number) =>
    `${data.property} ${data.negation ? 'NOT BETWEEN' : 'BETWEEN'} ${min} AND ${max}`;
const where: SQLSyntaxTemplate = () => () => 'WHERE';
const having: SQLSyntaxTemplate = () => () => 'HAVING';
const and: SQLSyntaxTemplate = () => () => 'AND';
const or: SQLSyntaxTemplate = () => () => 'OR';
const openParentheses: SQLSyntaxTemplate = () => () => '(';
const closeParentheses: SQLSyntaxTemplate = () => () => ')';
const orderBy: SQLSyntaxTemplate = () => (...sorting: string[]) =>
    `ORDER BY ${sorting.join(', ')}`;
const groupBy: SQLSyntaxTemplate = () => (...sorting: string[]) =>
    `GROUP BY ${sorting.join(', ')}`;
const join: SQLSyntaxTemplate = () => (table: string) =>
    `INNER JOIN ${table}`;
const leftJoin: SQLSyntaxTemplate = () => (table: string) =>
    `LEFT JOIN ${table}`;
const rightJoin: SQLSyntaxTemplate = () => (table: string) =>
    `RIGHT JOIN ${table}`;
const fullJoin: SQLSyntaxTemplate = () => (table: string) =>
    `FULL JOIN ${table}`;
const on: SQLSyntaxTemplate = () => (keyA: string, keyB: string) =>
    `ON ${keyA} = ${keyB}`;
const using: SQLSyntaxTemplate = () => (key: string) =>
    `USING(${key})`;
const whereIn: SQLSyntaxTemplate = () => (...keys: string[]) =>
    `IN (${keys.join(',')})`;
const limit: SQLSyntaxTemplate = () => (a: number, b?: number) =>
    `LIMIT ${b ? String(`${a}, ${b}`) : a}`;
const like: SQLSyntaxTemplate = (data: SQLSyntaxTemplateData) => (expression: string) =>
    `${data.property} ${data.negation ? 'NOT LIKE' : 'LIKE'} ${expression}`;
const union: SQLSyntaxTemplate = () => (query: string) =>
    `UNION ${query}`;
const unionAll: SQLSyntaxTemplate = () => (query: string) =>
    `UNION ALL ${query}`;
const exists: SQLSyntaxTemplate = (data: SQLSyntaxTemplateData) => (query: string) =>
    `${data.negation ? 'NOT EXISTS' : 'EXISTS'} ${query}`;

export const templates: Map<QuerySyntaxEnum, SQLSyntaxTemplate> = new Map<QuerySyntaxEnum, SQLSyntaxTemplate>([
    [QuerySyntaxEnum.Select, select],
    [QuerySyntaxEnum.Update, update],
    [QuerySyntaxEnum.Set, set],
    [QuerySyntaxEnum.EQ, eq],
    [QuerySyntaxEnum.Null, isNull],
    [QuerySyntaxEnum.GT, gt],
    [QuerySyntaxEnum.LT, lt],
    [QuerySyntaxEnum.And, and],
    [QuerySyntaxEnum.Or, or],
    [QuerySyntaxEnum.OpenParentheses, openParentheses],
    [QuerySyntaxEnum.CloseParentheses, closeParentheses],
    [QuerySyntaxEnum.Between, between],
    [QuerySyntaxEnum.Exists, exists],
    [QuerySyntaxEnum.Union, union],
    [QuerySyntaxEnum.UnionAll, unionAll],
    [QuerySyntaxEnum.Like, like],
    [QuerySyntaxEnum.Limit, limit],
    [QuerySyntaxEnum.FullJoin, fullJoin],
    [QuerySyntaxEnum.LeftJoin, leftJoin],
    [QuerySyntaxEnum.RightJoin, rightJoin],
    [QuerySyntaxEnum.Join, join],
    [QuerySyntaxEnum.GroupBy, groupBy],
    [QuerySyntaxEnum.OrderBy, orderBy],
    [QuerySyntaxEnum.From, from],
    [QuerySyntaxEnum.Delete, remove],
    [QuerySyntaxEnum.Insert, insert],
    [QuerySyntaxEnum.To, to],
    [QuerySyntaxEnum.Where, where],
    [QuerySyntaxEnum.On, on],
    [QuerySyntaxEnum.Using, using],
    [QuerySyntaxEnum.Exists, exists],
    [QuerySyntaxEnum.Having, having],
    [QuerySyntaxEnum.In, whereIn]
]);