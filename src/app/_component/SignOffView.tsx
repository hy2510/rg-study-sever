"use client";
import * as API from "@/app/_function/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RGLogo from "./RGLogo";

function readLocalStorageInfo(defaultHp: string) {
  let hp = defaultHp;
  let id = "";
  let pw = "";
  if (window && window.localStorage) {
    const store = window.localStorage;
    try {
      const authorizeData = store.getItem("authorizeDate");
      if (authorizeData) {
        const savedAuthorize = JSON.parse(authorizeData);
        if (savedAuthorize.hp && savedAuthorize.id && savedAuthorize.pw) {
          hp = savedAuthorize.hp;
          id = savedAuthorize.id;
          pw = savedAuthorize.pw;
        }
      }
    } catch (error) {}
  }
  return {
    hp,
    id,
    pw,
  };
}

function writeLocalStorageInfo(hp: string, id: string, pw: string) {
  if (window && window.localStorage) {
    const store = window.localStorage;
    try {
      const keepAuthorize = {
        hp,
        id,
        pw,
      };
      store.setItem("authorizeDate", JSON.stringify(keepAuthorize));
    } catch (error) {}
  }
}

function deleteLocalStorage() {
  if (window && window.localStorage) {
    const store = window.localStorage;
    try {
      store.removeItem("authorizeDate");
    } catch (error) {}
  }
}

export default function SignOffView({
  defaultHomepageUrl,
}: {
  defaultHomepageUrl?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const initReadLocalStorage = readLocalStorageInfo(
      defaultHomepageUrl || "https://dev.readinggate.com"
    );
    if (initReadLocalStorage.hp) {
      setHomepageUrl(initReadLocalStorage.hp);
    }
    if (initReadLocalStorage.id) {
      setId(initReadLocalStorage.id);
      setPw(initReadLocalStorage.pw);
      setSaveInfo(true);
    }
  }, [defaultHomepageUrl]);

  const [homepageUrl, setHomepageUrl] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [isSaveInfo, setSaveInfo] = useState(false);

  const hpInputRef = useRef<HTMLInputElement | null>(null);
  const idInputRef = useRef<HTMLInputElement | null>(null);
  const pwInputRef = useRef<HTMLInputElement | null>(null);

  const onRequestLogin = async () => {
    if (!homepageUrl) {
      hpInputRef?.current?.focus();
      return;
    }
    if (!id) {
      idInputRef?.current?.focus();
      return;
    }
    if (!pw) {
      pwInputRef?.current?.focus();
      return;
    }
    try {
      const response = await API.postSignIn({
        homepageUrl,
        id,
        pw,
      });
      if (response.accessToken) {
        if (isSaveInfo) {
          writeLocalStorageInfo(homepageUrl, id, pw);
        } else {
          deleteLocalStorage();
        }
        router.replace("/");
      }
    } catch (error) {
      alert("로그인 실패 !");
    }
  };

  useEffect(() => {
    if (hpInputRef?.current) {
      hpInputRef.current.focus();
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          marginTop: "120px",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          width: "400px", // 가로 크기를 크게 조정
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: "10px 0 20px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              padding: "0 20px",
              textAlign: "center",
              alignContent: "center",
              fontSize: "1.6em",
              fontWeight: "bold",
              color: "#00a0fd",
            }}
          >
            <RGLogo />
          </span>
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h4 style={{ margin: "10px 0 4px 0" }}>홈페이지 주소</h4>
          <input
            ref={hpInputRef}
            type="text"
            placeholder="홈페이지 주소"
            value={homepageUrl}
            onChange={(e) => setHomepageUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              margin: "0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
            onKeyDown={(e) => {
              if (e.key.toLocaleLowerCase() === "enter") {
                onRequestLogin();
              }
            }}
            required
          />
          <h4 style={{ margin: "10px 0 4px 0" }}>아이디</h4>
          <input
            ref={idInputRef}
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              margin: "0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
            onKeyDown={(e) => {
              if (e.key.toLocaleLowerCase() === "enter") {
                onRequestLogin();
              }
            }}
            required
          />
          <h4 style={{ margin: "10px 0 4px 0" }}>비밀번호</h4>
          <input
            ref={pwInputRef}
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              margin: "0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
            onKeyDown={(e) => {
              if (e.key.toLocaleLowerCase() === "enter") {
                onRequestLogin();
              }
            }}
            required
          />
          <div
            style={{ marginTop: "16px", display: "inline-block" }}
            onClick={() => setSaveInfo(!isSaveInfo)}
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
              {isSaveInfo ? "✔" : ""}
            </span>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.9em",
                WebkitUserSelect: "none",
              }}
            >
              로그인 정보 저장
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                width: "144px",
                height: "56px",
                margin: "0",
                padding: "0 10px",
                backgroundColor: "#00a0fd",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "1.3em",
                cursor: "pointer",
              }}
              onClick={() => onRequestLogin()}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
