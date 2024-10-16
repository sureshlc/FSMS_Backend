-- 1729000346344.do.production_consumption_create.sql

CREATE TABLE production_consumption (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(20) NOT NULL,
    element VARCHAR(255) NOT NULL,
    hs_digit VARCHAR(10) NOT NULL,
    hs_digit_description VARCHAR(255),
    hs_code VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    value NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);