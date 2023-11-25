import type { RequestEvent } from "@sveltejs/kit";

export const checkCookies = (event: RequestEvent) => {
  // get the cookies from the request
  const { cookies } = event;

  // get the user token from the cookie
  const token = cookies.get("znambg-token");
  const refreshToken = cookies.get("znambg-refresh_token");

  if (token && refreshToken) {
    return {
      token,
      refreshToken,
    };
  }

  return null;
};
