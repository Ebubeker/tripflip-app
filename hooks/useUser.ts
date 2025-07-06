import { supabase } from "@/lib/supabase";
import { User } from "@/type/user";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<undefined | User>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    try {
      supabase.auth.getSession().then((res) => {
        supabase
          .from("users")
          .select("*")
          .eq("email", res.data.session?.user.email)
          .then((userRes) => {
            setUser(userRes.data ? userRes.data[0] : undefined);
            setLoading(false);
          });
      });
    } catch (error) {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
  };
};
