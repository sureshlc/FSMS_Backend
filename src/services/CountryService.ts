import serviceResponse from "../response/ServiceResponse";
import { TColumnUnique } from "../types/PgQueryTypes/TColumns";
import { TServiceResponse } from "../types/ServiceResponseTypes/TServiceResponse";

class CountryService {
    getProvincesByCountry = async ({
        country,
    }: {
        country: TColumnUnique;
    }): Promise<TServiceResponse> => {
        return serviceResponse.ok({
            message: "Ok",
        });
    };
}
