import { ApiResponse, ApisauceInstance } from "apisauce";
import {
  IRequestError,
  IUserData,
  IResult,
  IUserUpdateData,
} from "../../Transforms";
import state from "../../Reducers";
import { UserActions } from "../../Reducers/User";

const getSelf =
  (api: ApisauceInstance) =>
  async (force_refresh: boolean = false): Promise<ApiResponse<IUserData | IRequestError>> => {
    const apiResponse = await api.get<IUserData, IRequestError>("/users/me" + (force_refresh ? "?force_refresh" : ""));
    if (apiResponse.ok) {
      state.dispatch(UserActions.setUserData(apiResponse.data));
    }
    return apiResponse;
  };

const getAll =
  (api: ApisauceInstance) =>
  async (force_refresh: boolean = false): Promise<ApiResponse<IUserData[], IRequestError>> => {
    const apiResponse = await api.get<IUserData[], IRequestError>("/users" + (force_refresh ? "?force_refresh" : ""));

    return apiResponse;
  };

const getUser =
  (api: ApisauceInstance) =>
  async (username: string, force_refresh: boolean = false): Promise<ApiResponse<IUserData, IRequestError>> => {
    const apiResponse = await api.get<IUserData, IRequestError>(
      `/users/${username}` + (force_refresh ? "?force_refresh" : "")
    );

    return apiResponse;
  };

const editSelf =
  (api: ApisauceInstance) =>
  async (userData: IUserUpdateData): Promise<ApiResponse<IResult>> => {
    const apiResponse = await api.post<IResult>("/users/me", userData);

    return apiResponse;
  };

export const userApiCalls = (api: ApisauceInstance) => ({
  GET_SELF: getSelf(api),
  GET_ALL_USERS: getAll(api),
  GET_USER: getUser(api),
  EDIT_SELF: editSelf(api),
});
