import Common from "@/repository/server/common";
import { NextRequest, NextResponse } from "next/server";
import {
  executeRequestAction,
  getBodyParameters,
  RouteResponse,
} from "../../_util";

export async function POST(request: NextRequest) {
  const parameter = await getBodyParameters(
    request,
    "homepageUrl",
    "id",
    "password",
    "deviceType"
  );
  const homepageUrl = parameter.getString("homepageUrl");
  const id = parameter.getString("id");
  const password = parameter.getString("password");
  const deviceType = parameter.getString("deviceType", "test");

  const [payload, status, error] = await executeRequestAction(
    Common.signin({ homepageUrl, id, password, deviceType })
  );

  if (error) {
    return RouteResponse.commonError();
  }
  const token = payload.accessToken;
  if (!token) {
    return NextResponse.json({ message: "User Check Fail" }, { status: 400 });
  }
  const response = NextResponse.json(payload, status);
  response.cookies.set("d-token", token);
  return response;
}
