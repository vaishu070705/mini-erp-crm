import pool from "../config/db";

export const getCustomers = async () => {
  const result = await pool.query(
    "SELECT * FROM customers ORDER BY id DESC"
  );
  return result.rows;
};

export const getCustomerById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM customers WHERE id = $1",
    [id]
  );
  return result.rows[0];
};
export const updateCustomer = async (
  id: number,
  customer_name: string,
  mobile: string,
  email: string,
  business_name: string,
  gst_number: string,
  customer_type: string,
  address: string,
  status: string,
  follow_up_date: string,
  notes: string
) => {
  const result = await pool.query(
    `UPDATE customers
     SET customer_name=$1,
         mobile=$2,
         email=$3,
         business_name=$4,
         gst_number=$5,
         customer_type=$6,
         address=$7,
         status=$8,
         follow_up_date=$9,
         notes=$10
     WHERE id=$11
     RETURNING *`,
    [
      customer_name,
      mobile,
      email,
      business_name,
      gst_number,
      customer_type,
      address,
      status,
      follow_up_date,
      notes,
      id,
    ]
  );

  return result.rows[0];
};
export const createCustomer = async (
  customer_name: string,
  mobile: string,
  email: string,
  business_name: string,
  gst_number: string,
  customer_type: string,
  address: string,
  status: string,
  follow_up_date: string,
  notes: string
) => {
  const result = await pool.query(
    `INSERT INTO customers
    (customer_name,mobile,email,business_name,gst_number,
    customer_type,address,status,follow_up_date,notes)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      customer_name,
      mobile,
      email,
      business_name,
      gst_number,
      customer_type,
      address,
      status,
      follow_up_date,
      notes,
    ]
  );

  return result.rows[0];
};
export const deleteCustomer = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM customers WHERE id=$1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

export const getCustomerFollowups = async (customerId: number) => {
  const result = await pool.query(
    `SELECT *
     FROM customer_followups
     WHERE customer_id = $1
     ORDER BY created_at DESC, id DESC`,
    [customerId]
  );

  return result.rows;
};

export const createCustomerFollowup = async (
  customerId: number,
  note: string,
  followUpDate: string,
  createdBy: string
) => {
  const result = await pool.query(
    `INSERT INTO customer_followups
     (customer_id, note, follow_up_date, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [customerId, note, followUpDate || null, createdBy || "System"]
  );

  return result.rows[0];
};
