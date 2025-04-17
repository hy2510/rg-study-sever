"server-only";

import { execute, makeRequest } from "./utils";

const getPath = (path: string): string => {
  return `${path}`;
};

async function signin(input: {
  homepageUrl: string;
  id: string;
  password: string;
  deviceType: string;
}) {
  const request = makeRequest({
    path: getPath("demo/login"),
    option: {
      method: "get",
      queryString: {
        homepageUrl: input.homepageUrl,
        id: input.id,
        pw: input.password,
        deviceType: input.deviceType,
      },
    },
  });
  return await execute(request);
}

async function todo(
  token: string,
  input: {
    sortColumn: string;
  }
) {
  const request = makeRequest({
    token,
    path: getPath("library/todo"),
    option: {
      method: "get",
      queryString: {
        sortColumn: input.sortColumn,
      },
    },
  });
  return await execute(request);
}

async function bookinfo(
  token: string,
  input: {
    levelRoundId: string;
    studyId: string;
    studentHistoryId: string;
  }
) {
  const request = makeRequest({
    token,
    path: getPath("library/book-info"),
    option: {
      method: "get",
      queryString: {
        levelRoundId: input.levelRoundId,
        studyId: input.studyId,
        studentHistoryId: input.studentHistoryId,
      },
    },
  });
  return await execute(request);
}

const Common = {
  signin,
  todo,
  bookinfo,
};
export default Common;
