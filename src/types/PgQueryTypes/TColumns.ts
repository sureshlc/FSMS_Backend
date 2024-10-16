const columns = [
    "title",
    "password",
    "created_at",
    "updated_at",
    "deleted_at",
    "domain",
    "element",
    "hs_digit",
    "hs_digit_description",
    "hs_code",
    "year",
    "unit",
    "value",
    "name",
    "is_capital",
    "country_id",
] as const;

const uniqueColumns = ["id", "email", "username", "name"] as const;

export type TColumn = (typeof columns)[number];
export type TColumnUnique = (typeof uniqueColumns)[number];
