"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import API from "../_function/api";
import { goDDR, goToStudy } from "../_function/start-study";

export type TypeStudy = {
  studyId: string;
  studentHistoryId: string;
  levelRoundId: string;
};

export default function StudyController({ study }: { study?: TypeStudy }) {
  const router = useRouter();

  const [studyInfo, setStudyInfo] = useState<{
    studyId: string;
    studentHistoryId: string;
    levelRoundId: string;
    bookCode: string;
    bookLevel: string;
  }>({
    studyId: "",
    studentHistoryId: "",
    levelRoundId: "",
    bookCode: "",
    bookLevel: "",
  });
  const [isModeStudent, setModeStudent] = useState(true);
  const [isAvailableSpeakStudy, setAvailableSpeakStudy] = useState(false);
  const [checkBookInfo, setCheckBookInfo] = useState<any | undefined>(
    undefined
  );

  const fetchCheckBookInfo = useCallback(async (study: TypeStudy) => {
    try {
      const { studyId, studentHistoryId, levelRoundId } = study;

      const bookinfo = await API.getBookInfo({
        studyId,
        studentHistoryId,
        levelRoundId,
      });

      setAvailableSpeakStudy(bookinfo.HighlightDataYn);

      const fixStudyId = bookinfo.StudyId;
      const fixStudentHistoryId = bookinfo.StudentHistoryId;
      const fixLevelRoundId = bookinfo.LevelRoundId;
      const bookCode = bookinfo.BookCode;
      const bookLevel = bookinfo.BookLevel;
      setStudyInfo({
        studyId: fixStudyId,
        studentHistoryId: fixStudentHistoryId,
        levelRoundId: fixLevelRoundId,
        bookCode,
        bookLevel,
      });
      setCheckBookInfo(bookinfo);
    } catch (error) {
      let alertMessage = "BookInfo Response Error";
      if (error instanceof Error) {
        try {
          const errorPayload = JSON.parse(error.message) as {
            status: number;
            message: string;
          };
          if (errorPayload.status === 401) {
            alert("로그인 유효시간이 만료되었습니다.");
            router.replace("signout");
            return;
          }
        } catch (parseError) {}
      }
      if (alertMessage) {
        alert(alertMessage);
      }
    }
  }, []);

  useEffect(() => {
    if (study) {
      fetchCheckBookInfo(study);
    }
  }, [study, fetchCheckBookInfo]);

  const onInputChange = (
    id: "studyId" | "studentHistoryId" | "bookCode" | "levelRoundId",
    value: string
  ) => {
    const newStudyInfo = { ...studyInfo };
    newStudyInfo[id] = value;
    if (id === "bookCode" && value.length > 5) {
      newStudyInfo.bookLevel = value.substring(3, 5);
    }
    setStudyInfo(newStudyInfo);
  };

  const onStartStudy = (isSpeak: boolean = false) => {
    const user = isModeStudent ? "student" : "staff";
    const mode = checkBookInfo.StudyStatus === "Completed" ? "review" : "quiz";
    goToStudy({
      studyInfo,
      user,
      mode,
      isStartSpeak: isSpeak,
    });
  };

  const onStartDDR = () => {
    goDDR();
  };

  const makeSelectValue = `${studyInfo.levelRoundId}#${studyInfo.studyId}#${studyInfo.studentHistoryId}`;
  const checkValue = checkBookInfo
    ? `${checkBookInfo.LevelRoundId}#${checkBookInfo.StudyId}#${checkBookInfo.StudentHistoryId}`
    : "";

  const isChecked = makeSelectValue === checkValue;
  const isBookInfoData = isChecked && checkBookInfo.StudyId;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: "0 0 240px",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{ display: "block", fontWeight: "bold", color: "#9b9b9b" }}
        >
          StudyId:{" "}
        </span>
        <input
          value={studyInfo.studyId}
          onChange={(e) => onInputChange("studyId", e.target.value)}
          style={{
            fontSize: "1.2em",
            marginBottom: "6px",
            border: "solid 1px #dfdfdf",
            borderRadius: "8px",
            padding: "6px",
          }}
        />
        <span
          style={{
            display: "block",
            fontWeight: "bold",
            color: "#9b9b9b",
            borderRadius: "8px",
            padding: "6px",
          }}
        >
          StudentHistoryId:{" "}
        </span>
        <input
          value={studyInfo.studentHistoryId}
          onChange={(e) => onInputChange("studentHistoryId", e.target.value)}
          style={{
            fontSize: "1.2em",
            marginBottom: "6px",
            border: "solid 1px #dfdfdf",
            borderRadius: "8px",
            padding: "6px",
          }}
        />
        <span
          style={{
            display: "block",
            fontWeight: "bold",
            color: "#9b9b9b",
            borderRadius: "8px",
            padding: "6px",
          }}
        >
          LevelRoundId:{" "}
        </span>
        <input
          value={studyInfo.levelRoundId}
          onChange={(e) => onInputChange("levelRoundId", e.target.value)}
          style={{
            fontSize: "1.2em",
            marginBottom: "6px",
            border: "solid 1px #dfdfdf",
            borderRadius: "8px",
            padding: "6px",
          }}
        />
        {isChecked ? (
          <div style={{ marginTop: "8px" }}>
            <span style={{ color: "#9b9b9b" }}>
              학습 정보가 설정되었습니다.
            </span>
          </div>
        ) : (
          <button
            disabled={
              !studyInfo.studyId ||
              !studyInfo.studentHistoryId ||
              !studyInfo.levelRoundId
            }
            onClick={() => {
              fetchCheckBookInfo({ ...studyInfo });
            }}
            style={{
              display: "block",
              fontSize: "1em",
              cursor: "pointer",
              padding: "0 20px",
              borderRadius: "20px",
              lineHeight: "40px",
              border: `solid 0px #000`,
              backgroundColor: `${
                !studyInfo.studyId ||
                !studyInfo.studentHistoryId ||
                !studyInfo.levelRoundId
                  ? "#dadada"
                  : "crimson"
              }`,
            }}
          >
            <span style={{ color: "#fff" }}>학습 정보 설정</span>
          </button>
        )}
      </div>
      {isBookInfoData ? (
        <>
          <div
            style={{
              flex: "0 0 160px",
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={checkBookInfo.SurfaceImage}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover", // 이미지가 잘리지 않도록 설정
                  borderRadius: "8px",
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  lineHeight: "15px",
                  marginTop: "8px",
                  padding: "5px 15px", // 좌우로 넓은 패딩을 설정하여 캡슐 모양을 만듭니다.
                  borderRadius: "15px", // 둥근 모서리 설정
                  border: "2px solid orange", // 테두리를 토마토 색상으로 설정
                  color: "#9b9b9b",
                  fontSize: "14px",
                  fontWeight: "bold",
                  backgroundColor: "white", // 배경색 추가
                  whiteSpace: "nowrap", // 텍스트를 한 줄로 표시
                }}
              >
                {checkBookInfo.BookCode}
              </span>
            </div>
          </div>
          <div
            style={{
              flex: "1 1 auto",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <div>
              <h3
                style={{
                  marginTop: "6px",
                  marginBottom: "16px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  lineHeight: "20px",
                  minHeight: "20px",
                  WebkitLineClamp: 1, // 줄 수를 제한
                  WebkitBoxOrient: "vertical",
                }}
              >
                {checkBookInfo.Title}
              </h3>
              <h4 style={{ marginTop: "16px", marginBottom: "4px" }}>
                학습 진행 상황
              </h4>
              <div>
                {checkBookInfo.DeleteYn ? (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      lineHeight: "0.8em",
                      fontSize: "0.8em",
                      fontWeight: "bold",
                      borderRadius: "16px",
                      border: "2px solid #ff274f",
                      backgroundColor: "white",
                      color: "#ff274f",
                      whiteSpace: "nowrap",
                    }}
                  >
                    처음 시작
                  </span>
                ) : checkBookInfo.StudyStatus === "Completed" ? (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      lineHeight: "0.8em",
                      fontSize: "0.8em",
                      fontWeight: "bold",
                      borderRadius: "16px",
                      border: "2px solid #666666",
                      backgroundColor: "#666666",
                      color: "white",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`완료(복습)`}
                  </span>
                ) : (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      lineHeight: "0.8em",
                      fontSize: "0.8em",
                      fontWeight: "bold",
                      borderRadius: "16px",
                      border: "2px solid #00a0fd",
                      backgroundColor: "white",
                      color: "#00a0fd",
                      whiteSpace: "nowrap",
                    }}
                  >
                    진행 중
                  </span>
                )}
              </div>
              <h4 style={{ marginTop: "16px", marginBottom: "4px" }}>
                학습 모드 선택
              </h4>
              <div
                onClick={() => setModeStudent(!isModeStudent)}
                style={{
                  display: "inline-block",
                  margin: "0 0",
                  padding: "0 0",
                  backgroundColor: "#fff",
                  borderRadius: "24px",
                  lineHeight: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    border: "solid 1px #c8c8c8",
                    verticalAlign: "middle",
                    lineHeight: "24px",
                    marginRight: "8px",
                    textAlign: "center",
                    WebkitUserSelect: "none",
                  }}
                >
                  {isModeStudent ? "" : "✔"}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.9em",
                    WebkitUserSelect: "none",
                  }}
                >
                  Staff
                </span>
              </div>
              <h4
                style={{ marginTop: "16px", marginBottom: "8px" }}
              >{`학습 시작 (${isModeStudent ? "학생모드" : "선생님모드"})`}</h4>
              <button
                style={{
                  display: "inline",
                  fontSize: "1.2em",
                  padding: "8px",
                  height: "48px",
                  minWidth: "96px",
                  cursor: "pointer",
                  backgroundColor: "#00a0fd",
                  border: "solid 2px #00a0fd",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                onClick={() => onStartStudy()}
              >
                Quiz
              </button>
              {isAvailableSpeakStudy && (
                <button
                  style={{
                    marginLeft: "20px",
                    display: "inline",
                    fontSize: "1.2em",
                    padding: "8px",
                    height: "48px",
                    minWidth: "96px",
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                    border: "solid 2px #ff274f",
                    borderRadius: "12px",
                    color: "#ff274f",
                  }}
                  onClick={() => onStartStudy(true)}
                >
                  Speak
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            border: "dashed 2px #999999",
            padding: "12px",
          }}
        >
          <ul>
            <li style={{ marginTop: "16px" }}>
              아래 목록에 있는 표지를 선택하면 자동으로 학습 정보 설정이
              완료됩니다.
            </li>
            <li style={{ marginTop: "16px" }}>
              왼쪽에 StudyId, StudentHistoryId, LevelRoundId를 입력 후 학습 정보
              설정 버튼을 눌러 수동으로 설정할 수 있습니다.
            </li>
          </ul>
        </div>
      )}

      <button
        style={{ position: "absolute", right: "40px" }}
        onClick={onStartDDR}
      >
        AI Studio
      </button>
    </div>
  );
}
