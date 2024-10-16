export type jwtPayload = {
    email: string;
    userId: number;
    userName?: string;
};

export type jwtExpireIn = "1hr" | "2hr" | "3hr" | "24hr";

export type jwtVerifyRes = {
    success: boolean;
    data?: any;
    message: string;
};
