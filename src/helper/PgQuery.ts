import { Pool } from "pg";
import { staticMessage } from "../config/statics";
import PgQueryResponse from "../response/PgQueryResponse";
import { TList } from "../types/PgQueryTypes/TList";
import { TResponse } from "../types/PgQueryTypes/TResponse";
import PgConfig from "../libs/pg";
import { TFindById } from "../types/PgQueryTypes/TFindById";
import { TTable } from "../types/PgQueryTypes/TTables";
import { TColumnUnique } from "../types/PgQueryTypes/TColumns";
import { TUpdateById } from "../types/PgQueryTypes/TUpdateById";
import { QueryResponseType } from "../types/PgQueryTypes/QueryResponse";

class PgQuery {
    private response: PgQueryResponse;
    private pool: Pool;
    constructor() {
        this.response = PgQueryResponse.getInstance();
        this.pool = PgConfig.getInstance().getPool();
    }
    findById = async (
        table: TTable,
        { id }: TFindById
    ): Promise<QueryResponseType> => {
        let query = `SELECT * FROM ${table} tb WHERE tb.id = '${id}' ;`;
        const rows = (await this.pool.query(query)).rows;

        return { success: true, message: "Data fetched", data: rows[0] };
    };

    findUnique = async (
        table: TTable,
        conditions: {
            column: TColumnUnique;
            value: string | number;
        }[]
    ): Promise<QueryResponseType> => {
        const whereClause = conditions
            .map((condition) => `${condition.column} = '${condition.value}'`)
            .join(" OR ");

        let query = `SELECT * FROM ${table} WHERE ${whereClause}`;
        try {
            const rows = (await this.pool.query(query)).rows;
            if (rows.length > 0) {
                return {
                    success: true,
                    message: "Data fetched",
                    data: rows[0],
                };
            } else {
                return {
                    success: false,
                    message: "Data not found",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Error executing query: ${String(error)}`,
            };
        }
    };

    findAll = async (
        table: TTable,
        { limit, sortBy, orderBy = "ASC" }: TList = {}
    ): Promise<QueryResponseType> => {
        let query = `SELECT * FROM ${table}`;
        if (sortBy) {
            query += `ORDER BY ${sortBy} ${orderBy}`;
        }
        if (limit) {
            if (limit <= 0) {
                return {
                    success: false,
                    message: staticMessage.LIMIT_WARNING,
                };
            }
            query += `LIMIT ${limit}`;
        }

        query += ";";

        const rows = (await this.pool.query(query)).rows;
        return { success: true, message: "Data fetched", data: rows };
    };

    updateById = async (
        table: TTable,
        { id }: TUpdateById
    ): Promise<QueryResponseType> => {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            let query = `
                UPDATE ${table}
                SET is_active = true,
                    is_verified = true,
                    updated_at = NOW()
                WHERE id = '${id}';
            `;
            const result = await client.query(query);
            const rowCount = result.rowCount;
            if (rowCount && rowCount > 0) {
                await client.query("COMMIT");
                return { success: true, message: "Record updated" };
            }
            await client.query("ROLLBACK");
            return { success: false, message: "Invalid table name or id" };
        } catch (error) {
            await client.query("ROLLBACK");
            return { success: false, message: String(error) };
        } finally {
            client.release();
        }
    };

    customQuery = async (query: string): Promise<QueryResponseType> => {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const result = await client.query(query);
            const rowCount = result.rowCount;

            if (rowCount && rowCount > 0) {
                await client.query("COMMIT");
                return {
                    success: true,
                    message: "Custom query executed successfully",
                    data: result.rows,
                };
            }
            await client.query("ROLLBACK");
            return { success: false, message: "Custom query error" };
        } catch (error) {
            await client.query("ROLLBACK");
            return { success: false, message: String(error) };
        } finally {
            client.release();
        }
    };

    create = async (
        table: TTable,
        data: { [column: string]: string | number }
    ): Promise<QueryResponseType> => {
        const columns = Object.keys(data).join(", ");
        const values = Object.values(data)
            .map((value) => (typeof value === "string" ? `'${value}'` : value))
            .join(", ");

        const query = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;

        try {
            const result = await this.pool.query(query);
            const row = result.rows[0];
            return {
                success: true,
                message: "Record created successfully",
                data: row,
            };
        } catch (error) {
            return {
                success: false,
                message: `Error executing query: ${String(error)}`,
            };
        }
    };
}

const pgQuery = new PgQuery();

export default pgQuery;
