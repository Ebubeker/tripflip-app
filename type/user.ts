export type User = {
  auth_id: string;
  avatar_url: string | null;
  bio: string | null;
  budget_range_max: number | null;
  budget_range_min: number | null;
  city: string | null;
  country: string | null;
  created_at: string; // ISO date string
  date_of_birth: string | null;
  deleted_at: string | null;
  display_name: string;
  email: string;
  first_name: string;
  gender: string | null;
  id: string;
  languages_spoken: string[];
  last_login_at: string | null;
  last_name: string;
  notification_preferences: {
    email_notifications: boolean;
    friend_requests: boolean;
    push_notifications: boolean;
    travel_recommendations: boolean;
    trip_reminders: boolean;
  };
  phone: string | null;
  preferred_accommodation: string;
  preferred_currency: string;
  travel_interests: string[];
  travel_style: string;
  trip_count: number;
  updated_at: string; // ISO date string
  username: string;
};
