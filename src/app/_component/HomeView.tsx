"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "../_function/api";
import SignOnView from "./SignOnView";
import { Todo } from "./TodoList";

export default function HomeView() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expireToken, setExpireToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetching = async () => {
      try {
        const todos = await API.getTodo();
        setTodos(todos);
        setLoading(false);
      } catch (error) {
        if (error && (error as any).message) {
          const errorPayload = JSON.parse((error as any).message) as {
            status: number;
          };
          if (errorPayload.status === 401) {
            setExpireToken(true);
          }
        }
        setError(true);
      }
    };
    fetching();
    setLoading(true);
  }, []);

  if (expireToken) {
    setTimeout(() => router.replace("/signout"), 500);
    return <></>;
  }
  if (error) {
    return <div>Todo 조회 실패</div>;
  }
  if (loading) {
    return <div></div>;
  }
  return <SignOnView todo={todos} />;
}
