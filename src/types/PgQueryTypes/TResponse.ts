export type TResponse = {
    message?: string;
    success?: boolean;
    data?: any[] | any;
};
export type TResponsePayload = Omit<TResponse, "status">;
