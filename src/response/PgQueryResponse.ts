import { TResponse, TResponsePayload } from "../types/PgQueryTypes/TResponse";

class PgQueryResponse {
    public static instance: PgQueryResponse;
    private constructor() {}

    public static getInstance(): PgQueryResponse {
        if (!PgQueryResponse.instance) {
            PgQueryResponse.instance = new PgQueryResponse();
        }
        return PgQueryResponse.instance;
    }

    bad = ({ message = "Invalid Query" }: TResponsePayload = {}): TResponse => {
        return {
            message,
            success: false,
        };
    };

    ok = ({
        message = "Query Successfully executed",
        success = true,
        data,
    }: TResponsePayload = {}): TResponse => {
        return {
            message,
            success,
            data,
        };
    };
}

export default PgQueryResponse;
