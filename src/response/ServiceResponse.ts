import { TServiceResponse } from "../types/ServiceResponseTypes/TServiceResponse";

class ServiceResponse {
    public ok = ({
        message = "Successful",
        statusCode = 200,
        data,
        success = true,
    }: TServiceResponse = {}): TServiceResponse => {
        return {
            message,
            success,
            statusCode,
            data,
        };
    };

    public bad = ({
        message = "error occurred",
        statusCode = 422,
        data,
        success = false,
    }: TServiceResponse = {}): TServiceResponse => {
        return {
            message,
            success,
            statusCode,
            data,
        };
    };
}

const serviceResponse = new ServiceResponse();
export default serviceResponse;
