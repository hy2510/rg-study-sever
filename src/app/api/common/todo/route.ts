import {
  executeRequestAction,
  getAuthorizationWithCookie,
  RouteResponse,
} from "@/app/api/_util";
import Common from "@/repository/server/common";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = getAuthorizationWithCookie().getActiveAccessToken();
  if (!token) {
    return RouteResponse.invalidAccessToken();
  }
  const sortColumn = "RegistDate";

  const [payload, status, error] = await executeRequestAction(
    Common.todo(token, { sortColumn })
  );
  if (error) {
    return RouteResponse.commonError();
  }
  return RouteResponse.response(payload, status);
}
