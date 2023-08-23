import { create } from "apisauce";
import AppConfig from "../../Config/AppConfig";
import { authApiCalls } from "./Auth";
import { userApiCalls } from "./User";
import { teamApiCalls } from "./Teams";
import { challengeApiCalls } from "./Challenges";
import { pictureApiCalls } from "./Picture";
import store from "../../Reducers";

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
  if (response.status === 401 || response.status === 403) {
    await authApiCalls(AUTH_API).REFRESH_TOKEN();
    const data = await BASE_API.any(response.config!);
    // replace data
    response.data = data.data;
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
