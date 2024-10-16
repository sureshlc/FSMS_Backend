export type TServiceResponse = Partial<{
    success: boolean;
    statusCode: number;
    message: string;
    data: any;
}>;
