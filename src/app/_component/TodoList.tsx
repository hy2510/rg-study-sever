"use client";

export default function TodoList({
  list,
  onTodoItemClickListener,
}: {
  list: Todo[];
  onTodoItemClickListener?: (todo: Todo) => void;
}) {
  return (
    <div>
      <h2>{`Todo 목록 (${list.length})`}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(144px, 1fr))",
          gap: "10px",
        }}
      >
        {list.map((todo) => {
          return (
            <TodoBook
              key={todo.StudyId}
              item={todo}
              onItemClick={onTodoItemClickListener}
            />
          );
        })}
      </div>
    </div>
  );
}

function TodoBook({
  item,
  onItemClick,
}: {
  item: Todo;
  onItemClick?: (item: Todo) => void;
}) {
  return (
    <div
      onClick={() => onItemClick && onItemClick(item)}
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "240px", // 고정된 높이 설정
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end", // 이미지가 컨테이너의 아래쪽에 정렬되도록 설정
          overflow: "hidden",
        }}
      >
        <img
          src={item.SurfaceImagePath}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "cover", // 이미지가 잘리지 않도록 설정
            borderRadius: "8px",
          }}
        />
      </div>
      <div>
        <span
          style={{
            display: "inline-block",
            marginTop: "4px",
            lineHeight: "15px",
            padding: "5px 15px", // 좌우로 넓은 패딩을 설정하여 캡슐 모양을 만듭니다.
            borderRadius: "15px", // 둥근 모서리 설정
            border: "2px solid orange", // 테두리를 토마토 색상으로 설정
            color: "#9b9b9b",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {item.LevelName}
        </span>
        <h4
          style={{
            marginTop: "6px",
            marginBottom: "16px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            lineHeight: "20px",
            minHeight: "60px",
            WebkitLineClamp: 3, // 줄 수를 제한
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.Title}
        </h4>
      </div>
    </div>
  );
}

export type Todo = {
  StudyId: string;
  StudentHistoryId: string;
  LevelName: string;
  LevelRoundId: string;
  SurfaceImagePath: string;
  BookId: number;
  Title: string;
};
