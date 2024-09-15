import {ApiResponse, ApisauceInstance} from "apisauce";
import {IRequestError, IResult, IUserData, IUserUpdateData,} from "../../Transforms";
import state from "../../Reducers";
import {UserActions} from "../../Reducers/User";
import AppConfig from "../../Config/AppConfig";

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


interface IResetPasswordData {
    username: string;
    password: string;
    code: string;
}

interface IResetPasswordSendCodeData {
    username: string;
}

const reset_password =
(api: ApisauceInstance) =>
    async ( data: IResetPasswordData ): Promise<ApiResponse<IResult>> => {
        const apiResponse = await api.post<IResult>("/reset_password", {
            ...data,
            ClientId: AppConfig.cognitoUserPoolClientId
        });

        return apiResponse;
    };
        
const reset_password_send_code =
(api: ApisauceInstance) =>
    async ( data: IResetPasswordSendCodeData ): Promise<ApiResponse<IResult>> => {
        const apiResponse = await api.post<IResult>("/reset_password_code_send", {
            ...data,
            ClientId: AppConfig.cognitoUserPoolClientId
        });

        return apiResponse;
    };

export const userApiCalls = (api: ApisauceInstance) => ({
    GET_SELF: getSelf(api),
    GET_ALL_USERS: getAll(api),
    GET_USER: getUser(api),
    EDIT_SELF: editSelf(api),
    USER_RESET_PASSWORD: reset_password(api),
    USER_RESET_PASSWORD_SEND_CODE: reset_password_send_code(api),
});
