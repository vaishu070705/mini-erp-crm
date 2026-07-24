import pool from "../config/db";

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  return result.rows[0];
};

export const createUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const result = await pool.query(
    `INSERT INTO users(full_name,email,password)
     VALUES($1,$2,$3)
     RETURNING *`,
    [fullName, email, password]
  );

  return result.rows[0];
};