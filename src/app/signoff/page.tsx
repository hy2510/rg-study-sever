"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import API from "../_function/api";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    async function fetching() {
      await API.getSignOut();
      router.replace("/signin");
    }
    fetching();
  }, []);

  return <div>Logoff....</div>;
}
