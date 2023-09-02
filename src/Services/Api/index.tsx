import { create } from "apisauce";
import AppConfig from "../../Config/AppConfig";
import { authApiCalls } from "./Auth";
import { userApiCalls } from "./User";
import { teamApiCalls } from "./Teams";
import { challengeApiCalls } from "./Challenges";
import { pictureApiCalls } from "./Picture";
import store from "../../Reducers";
import { loggedIn } from "../../Reducers/Auth";

export const AUTH_API = create({
  baseURL: AppConfig.apiUrls.cognito,
  headers: {
    "Content-Type": "application/x-amz-json-1.1",
  },
});

export const BASE_API = create({
  baseURL: AppConfig.apiUrls.dev,
});

BASE_API.addAsyncResponseTransform(async (response) => {
  if (response.data?.message === "The incoming token has expired") {
    const authData = await authApiCalls(AUTH_API).REFRESH_TOKEN();
    if (authData.ok) {
      var config = response.config!;
      config.headers!["Authorization"] =
        authData.data!.AuthenticationResult.TokenType +
        " " +
        authData.data!.AuthenticationResult.IdToken;
      const data = await BASE_API.any(response.config!);
      response.data = data.data;
    }
  }
});

export default {
  apiCalls: {
    ...authApiCalls(AUTH_API),
    ...userApiCalls(BASE_API),
    ...teamApiCalls(BASE_API),
    ...challengeApiCalls(BASE_API),
    ...pictureApiCalls(BASE_API),
  },
};
