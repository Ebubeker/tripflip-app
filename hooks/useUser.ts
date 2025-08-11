import { getUserAnalytics } from "@/lib/api/trip";
import { supabase } from "@/lib/supabase";
import { User } from "@/type/user";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<undefined | User>(undefined);
  const [userAnalyticsData, setUserAnalyticsData] = useState<
    | undefined
    | {
        countriesVisited: string[];
        totalTrips: number;
      }
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = () => {
    try {
      supabase.auth.getSession().then((res) => {
        supabase
          .from("users")
          .select("*")
          .eq("email", res.data.session?.user.email)
          .then((userRes) => {
            if (userRes.data) {
              getUserAnalytics(userRes.data[0].id)
                .then((res) => {
                  setUserAnalyticsData(res.data ? res.data : undefined);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            setUser(userRes.data ? userRes.data[0] : undefined);
            setLoading(false);
          });
      });
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchUser();
  }, []);
  // useEffect(() => {
  //   if(user){
  //     getUserAnalytics(user?.id).then((res) => {
  //       console.log(res)
  //     })
  //   }
  // }, [])

  return {
    user,
    userAnalyticsData,
    loading,
    refetch: () => {
      fetchUser();
    }
  };
};
