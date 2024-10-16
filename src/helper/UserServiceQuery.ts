import { TUserRegister } from "../types/ApiRequestTypes/TUserRegister";

class UserServiceQuery {
    register = ({ name, email, password, phone }: TUserRegister): string => {
        let query = `
        WITH new_user AS (
            INSERT INTO users (name)
            VALUES('${name}')
            RETURNING id
        )
        INSERT INTO auth (user_id, email, phone, password)
            VALUES(
                (SELECT id FROM new_user),
                '${email}',
                '${phone}',
                '${password}'
                );
        `;
        return query;
    };

    verify = (id: number): string => {
        let query = `
        UPDATE auth 
        SET is_active = true, 
            is_verified = true,
            updated_at = NOW()
        WHERE id = '${id}';
        `;
        return query;
    };

    listAllUsersExpectMe = (currentUserId: number): string => {
        let query = `
        SELECT
            u.id,
            u.name,
            a.email,
            a.phone
        FROM 
            users u
        JOIN
            auth a ON u.id = a.user_id
        WHERE 
            u.id NOT IN (1, ${currentUserId})
            AND a.is_active = true;
        `;
        return query;
    };
}

const userServiceQuery = new UserServiceQuery();
export default userServiceQuery;
