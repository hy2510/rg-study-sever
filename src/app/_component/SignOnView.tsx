"use client";

import Link from "next/link";
import { useState } from "react";
import RGLogo from "./RGLogo";
import StudyController, { TypeStudy } from "./StudyController";
import TodoList, { Todo } from "./TodoList";

export default function SignOnView({ todo }: { todo: Todo[] }) {
  const [studyInfo, setStudyInfo] = useState<TypeStudy | undefined>(undefined);
  const [todos, setTodos] = useState<Todo[]>(todo);

  const onTodoItemClickListener = (todo: Todo) => {
    const study: TypeStudy = {
      studyId: todo.StudyId,
      studentHistoryId: todo.StudentHistoryId,
      levelRoundId: todo.LevelRoundId,
    };
    setStudyInfo(study);
  };

  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "60px",
          backgroundColor: "#00a0fd",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            padding: "0 20px",
            textAlign: "center",
            alignContent: "center",
            fontSize: "1.6em",
            fontWeight: "bold",
            color: "white",
          }}
        >
          <RGLogo isWhite={true} />
        </span>
        <div style={{ alignContent: "center" }}>
          <Link
            href="signoff"
            style={{
              padding: "0 20px",
              textAlign: "center",
              alignContent: "center",
              fontSize: "1.0em",
              fontWeight: "bold",
              color: "white",
            }}
          >
            EXIT
          </Link>
        </div>
      </div>
      <div
        style={{
          height: "320px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid #ccc",
          padding: "20px",
          boxSizing: "border-box",
          overflow: "auto", // 스크롤 고정
        }}
      >
        <StudyController study={studyInfo} />
        <hr />
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {todos && (
          <TodoList
            list={todos}
            onTodoItemClickListener={onTodoItemClickListener}
          />
        )}
      </div>
    </main>
  );
}
