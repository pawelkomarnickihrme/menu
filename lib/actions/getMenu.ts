"use server";
import { createSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

// The actual function that fetches from Supabase
const fetchMenu = async () => {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("editor_documents")
    .select("*")
    .eq("active", true)
    .single(); // Use single() to get one document

  if (error) {
    console.error("Error fetching active document:", error);
    return null; // Return null if there's an error
  }

  return data; // Return the active document data
};

// Cached version of the function
export const getMenu = unstable_cache(
  fetchMenu,
  ["menu-data"], // Cache key
  {
    tags: ["menu"], // Cache tags for revalidation
  }
);

import { revalidateTag } from "next/cache";

export async function revalidateMenu() {
  revalidateTag("menu");
}
