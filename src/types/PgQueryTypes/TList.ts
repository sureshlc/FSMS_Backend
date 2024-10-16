import { TColumn } from "./TColumns";

export type TList = {
    limit?: number;
    sortBy?: TColumn;
    orderBy?: "ASC" | "DESC";
    where?:{};
};
