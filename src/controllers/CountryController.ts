import { Request, Response } from "express";
import apiResponse from "../response/ApiResponse";

class CountryController {
    public async getProvinces(req: Request, res: Response): Promise<Response> {
        try {
            const params = req.query;
            console.log(params);
            return apiResponse.ok(res);
        } catch (error) {
            return apiResponse.bad(res);
        }
    }
}

export default new CountryController();
