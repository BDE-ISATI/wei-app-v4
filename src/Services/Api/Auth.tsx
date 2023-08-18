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

interface IRegisterData {
  username: string;
  email: string;
  password: string;
}

const login =
  (api: ApisauceInstance) =>
  async (
    data: ILoginData
  ): Promise<ApiResponse<IAuthLoginResponse, IRequestError>> => {
    const apiResponse = await api.post<IAuthLoginResponse, IRequestError>(
      "",
      {
        AuthParameters: {
          USERNAME: data.username,
          PASSWORD: data.password,
        },
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: AppConfig.cognitoUserPoolClientId,
      },
      {
        headers: {
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        },
      }
    );

    if (apiResponse.ok) {
      let authData = apiResponse.data!.AuthenticationResult;
      BASE_API.setHeader(
        "Authorization",
        authData.TokenType + " " + authData.IdToken
      );
    }
    return apiResponse;
  };

const register =
  (api: ApisauceInstance) =>
  async (
    data: IRegisterData
  ): Promise<ApiResponse<IAuthLoginResponse, IRequestError>> => {
    const apiResponse = await api.post<IAuthLoginResponse, IRequestError>(
      "",
      {
        Username: data.username,
        Password: data.password,
        UserAttributes: [
          {
            Name: "email",
            Value: data.email,
          },
        ],
        ClientId: AppConfig.cognitoUserPoolClientId,
      },
      {
        headers: {
          "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
        },
      }
    );
    console.log(apiResponse);

    return apiResponse;
  };

export const authApiCalls = (api: ApisauceInstance) => ({
  USER_LOGIN: login(api),
  USER_REGISTER: register(api),
});
