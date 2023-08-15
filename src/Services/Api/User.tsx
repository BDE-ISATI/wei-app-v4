import { ApiResponse, ApisauceInstance } from "apisauce";
import AppConfig from "../../Config/AppConfig";
import { IRequestError, IUserData } from "../../Transforms";

const getSelf =
  (api: ApisauceInstance) =>
  async (): Promise<ApiResponse<IUserData | IRequestError>> => {
    const apiResponse = await api.get<IUserData, IRequestError>("/users/me");

    return apiResponse;
  };

const getAll =
  (api: ApisauceInstance) =>
  async (): Promise<ApiResponse<IUserData[], IRequestError>> => {
    const apiResponse = await api.get<IUserData[], IRequestError>("/users");

    return apiResponse;
  };

const getUser =
  (api: ApisauceInstance) =>
  async (username: string): Promise<ApiResponse<IUserData, IRequestError>> => {
    const apiResponse = await api.get<IUserData, IRequestError>(
      `/users/${username}`
    );

    return apiResponse;
  };

export const userApiCalls = (api: ApisauceInstance) => ({
  GET_SELF: getSelf(api),
  GET_ALL_USERS: getAll(api),
  GET_USER: getUser(api),
});
