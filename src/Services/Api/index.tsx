import {create} from "apisauce";
import AppConfig from "../../Config/AppConfig";
import {authApiCalls} from "./Auth";
import {userApiCalls} from "./User";
import {teamApiCalls} from "./Teams";
import {challengeApiCalls} from "./Challenges";

export const AUTH_API = create({
    baseURL: AppConfig.apiUrls.cognito,
    headers: {
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "Content-Type": "application/x-amz-json-1.1",
    },
});

export const BASE_API = create({
    baseURL: AppConfig.apiUrls.dev,
});

export default {
    apiCalls: {
        ...authApiCalls(AUTH_API),
        ...userApiCalls(BASE_API),
        ...teamApiCalls(BASE_API),
        ...challengeApiCalls(BASE_API),
    },
};
