import { supabase } from "../lib/supabase";

export const fetchLoader = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data;
};

const fetchTableData = async (table: string) => {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    throw error;
  }
  return data;
};

export const adminLoader = () => fetchTableData("admins");
export const roomLoader = () => fetchTableData("rooms");
export const paymentLoader = () => fetchTableData("payments");
export const userLoader = () => fetchTableData("profiles");

