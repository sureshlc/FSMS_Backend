import pgQuery from "../../helper/PgQuery";
import { TColumnUnique } from "../../types/PgQueryTypes/TColumns";

class CountryRepo {
    stateListByCountry = async (country:TColumnUnique) => {
            let x =  await pgQuery.findAll()
    }
}