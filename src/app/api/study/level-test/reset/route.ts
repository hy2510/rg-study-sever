import {
  RouteResponse,
  executeRequestAction,
  getAuthorizationWithCookie,
  getParameters,
} from "@/app/api/_util";
import LevelTest from "@/repository/server/level-test";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const token = getAuthorizationWithCookie().getActiveAccessToken();
  if (!token) {
    return RouteResponse.invalidAccessToken();
  }

  const parameter = await getParameters(request, "levelTestId");
  const levelTestId = parameter.getString("levelTestId", "");

  const [payload, status, error] = await executeRequestAction(
    LevelTest.resetTest(token, { levelTestId })
  );
  if (error) {
    return RouteResponse.commonError();
  }
  return RouteResponse.response(payload, status);
}
