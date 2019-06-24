import { Property, Table, QuerySyntaxEnum } from "@chego/chego-api";
import { escape } from "sqlstring"

export const parsePropertyToString = (property: Property, useAlias: boolean = true): string =>
    (useAlias && property.alias && property.type !== QuerySyntaxEnum.Alias)
        ? property.alias
        : property.table
            ? `${property.table.name}.${property.name}`
            : property.name;

export const parseTableToString = (table: Table, useAlias?: boolean): string =>
    useAlias && table.alias
        ? table.alias
        : table.name;

export const parsePropertyToEquation = (properties: any) => (list: string[], key: string) =>
    (list.push(`${key} = ${properties[key]}`), list);

export const escapeValue = (value: any): any => {
    if (typeof value === 'string') {
        return escape(value);
    }
    return value;
}