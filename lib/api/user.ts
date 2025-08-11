import { supabase } from "../supabase";

export const updateUser = async (
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    city?: string;
    country?: string;
    travel_style?: string;
    preferred_currency?: string;
    travel_interests?: string[];
  }
) => {
  const formattedData = {
    first_name: updates.firstName,
    last_name: updates.lastName,
    email: updates.email,
    avatar_url: updates.avatarUrl,
    city: updates.city,
    country: updates.country,
    travel_style: updates.travel_style,
    preferred_currency: updates.preferred_currency,
    travel_interests: updates.travel_interests
  };

  const { data, error } = await supabase
    .from("users")
    .update(formattedData)
    .eq("id", userId)
    .select();

  if (error) {
    console.error("Error updating user:", error);
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
};
