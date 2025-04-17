import {
  RouteResponse,
  executeRequestAction,
  getAuthorizationWithCookie,
} from "@/app/api/_util";
import LevelTest from "@/repository/server/level-test";

export async function commonGet(path: string, search?: string) {
  const token = getAuthorizationWithCookie().getActiveAccessToken();
  if (!token) {
    return RouteResponse.invalidAccessToken();
  }

  const [payload, status, error] = await executeRequestAction(
    LevelTest.commonGet(
      token,
      `${path}${search && search.length > 1 ? search : ""}`
    )
  );
  if (error) {
    return RouteResponse.commonError();
  }
  return RouteResponse.response(payload, status);
}
