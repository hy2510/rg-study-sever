export async function postSignIn(input: {
  homepageUrl: string;
  id: string;
  pw: string;
}) {
  const { homepageUrl, id, pw } = input;
  const response = await fetch("api/common/signin", {
    method: "post",
    body: JSON.stringify({
      homepageUrl,
      id: id,
      password: pw,
      deviceType: "",
    }),
  });
  return await parseResponse(response);
}

export async function getSignOut() {
  const response = await fetch("api/common/signout");
  return await parseResponse(response);
}

export async function getTodo(): Promise<any[]> {
  const response = await fetch("api/common/todo");
  return (await parseResponse(response)).Todo;
}

export async function getBookInfo(input: {
  studyId: string;
  studentHistoryId: string;
  levelRoundId: string;
}) {
  const { studyId, studentHistoryId, levelRoundId } = input;
  const response = await fetch("api/common/bookinfo", {
    method: "post",
    body: JSON.stringify({
      studyId,
      studentHistoryId,
      levelRoundId,
    }),
  });
  return await parseResponse(response);
}

async function parseResponse(res: Response) {
  let resError:
    | {
        status: number;
        message: string;
      }
    | undefined = undefined;
  try {
    if (res.ok) {
      return await res.json();
    } else {
      resError = {
        status: res.status,
        message: "Response not ok.",
      };
      if (res.status === 401) {
        resError.message = "Access token validate failed.";
      }
      throw new Error(JSON.stringify(resError));
    }
  } catch (error) {
    if (!resError) {
      resError = {
        status: 500,
        message: "Unknown Response Error.",
      };
    }
    throw Error(JSON.stringify(resError));
  }
}

const API = {
  postSignIn,
  getSignOut,
  getTodo,
  getBookInfo,
};
export default API;
