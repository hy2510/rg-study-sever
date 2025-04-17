# readinggate-study-nextjs

리딩게이트 학습 프로그램 개발환경 연동 프로젝트

## 개요

기존 학생 프로젝트에 학습 개발환경을 연동하게되면 프로젝트 구동을 위한 사전 준비작업이 필요하다. 이를 간소화하여 학습 프로그램 개발에 집중할 수 있도록 하기 위한 프로젝트이다.

## 프로젝트 환경

- Node 20 LTS
- NPM 10
- Typescript 5
- NextJS 14.2

## 프로젝트 설정

명령프롬프트(CMD) 또는 터미널 실행 후 프로젝트 폴더 이동하여 명령어 입력

```
npm install
```

## 개발환경 설정

개발환경은 .env 환경변수를 통해 관리된다.

### 환경변수

- **FLAG_DB_DEV**: 값(Y 또는 N) 개발 Database와 운영 Database를 선택한다. Y로 선택하면 개발 Database로 요청한다.
- **API_BASE_URL_PROD**: 값(http부터 /로 끝나야 함) API를 요청하는 운영서버 HOST 주소이다.
- **API_BASE_URL_DEV**: 값(http부터 /로 끝나야 함) API를 요청하는 개발서버 HOST 주소이다.
- **API_BASE_VERSION**: 값(v1 ... vn) API에서 정의된 버전이다. API와 협의된 버전을 입력한다.
- **STUDY_BOOK_REAINDG_ENABLE_RE_WRITES**: 값(Y 또는 N) Y로 설정하고 Book Reading 학습 개발서버를 구동하는 경우, public 폴더 대신 학습 개발서버로 연동한다. N 인 경우에는 public 폴더의 파일을 전송한다.
- **STUDY_BOOK_REAINDG_SERVICE_URL**: 값(개발 서버 주소) STUDY_BOOK_REAINDG_ENABLE_RE_WRITES 값이 Y인 경우, 개발서버를 구동하고, URL 정보를 입력해야 한다.
- **STUDY_BOOK_READING_PATH**: 값(URL re-write 경로) STUDY_BOOK_REAINDG_ENABLE_RE_WRITES 값이 Y인 경우, 이 경로로 접속하면 STUDY_BOOK_REAINDG_SERVICE_URL 경로로 re write한다.

## 프로젝트 개발 실행

명령프롬프트(CMD) 또는 터미널 실행 후 프로젝트 폴더 이동하여 명령어 입력

```
npm run dev
```

구동을 하게 되면 3000번 포트로 실행되어 브라우저에서 http:://localhost:3000/ 주소를 입력하면 접속 가능하다.

## 프로젝트 빌드

명령프롬프트(CMD) 또는 터미널 실행 후 프로젝트 폴더 이동하여 명령어 입력

```
npm run build
```

개발 환경이기 때문에 빌드를 할 필요는 없으나, 구동하고 있는 컴퓨터의 성능상의 이슈가 있는 경우, 빌드 한 후 실행하면 디버깅하는 기능이 제외되면서 컴퓨터에 부담을 줄일 수 있다.

## 프로젝트 실행

명령프롬프트(CMD) 또는 터미널 실행 후 프로젝트 폴더 이동하여 명령어 입력

```
npm run start
```

프로젝트를 빌드하였다면, dev가 아닌 start로 실행해야 정상적으로 구동된다.
