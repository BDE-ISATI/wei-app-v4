import { ApiResponse, ApisauceInstance } from "apisauce";
import AppConfig from "../../Config/AppConfig";
import { IRequestError } from "../../Transforms/ApiError";
import { BASE_API } from ".";

interface IAuthLoginData {
  AccessToken: string;
  ExpiresIn: number;
  IdToken: string;
  RefreshToken: string;
  TokenType: string;
}

interface IAuthLoginResponse {
  AuthenticationResult: IAuthLoginData;
  ChallengeParameters: {};
}

interface ILoginData {
  username: string;
  password: string;
}

const login =
  (api: ApisauceInstance) =>
  async (data: ILoginData): Promise<IAuthLoginData | undefined> => {
    const apiResponse = await api.post<IAuthLoginResponse, IRequestError>("", {
      AuthParameters: {
        USERNAME: data.username,
        PASSWORD: data.password,
      },
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: AppConfig.cognitoUserPoolClientId,
    });

    if (apiResponse.ok) {
      let authData = apiResponse.data!.AuthenticationResult;
      BASE_API.setHeader(
        "Authorization",
        authData.TokenType + " " + authData.IdToken
      );
      return authData;
    }
    return undefined;
  };

export const authApiCalls = (api: ApisauceInstance) => ({
  USER_LOGIN: login(api),
});
