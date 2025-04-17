import {
  executeRequestAction,
  getAuthorizationWithCookie,
  getBodyParameters,
  RouteResponse,
} from "@/app/api/_util";
import Common from "@/repository/server/common";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const token = getAuthorizationWithCookie().getActiveAccessToken();
  if (!token) {
    return RouteResponse.invalidAccessToken();
  }

  const parameter = await getBodyParameters(
    request,
    "levelRoundId",
    "studyId",
    "studentHistoryId"
  );
  const levelRoundId = parameter.getString("levelRoundId");
  const studyId = parameter.getString("studyId");
  const studentHistoryId = parameter.getString("studentHistoryId");

  const action = Common.bookinfo(token, {
    levelRoundId,
    studyId,
    studentHistoryId,
  });
  const [payload, status, error] = await executeRequestAction(action);
  if (error) {
    return RouteResponse.commonError();
  }
  return RouteResponse.response(
    { ...payload, LevelRoundId: levelRoundId },
    status
  );
}
