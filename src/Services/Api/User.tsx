import { ApiResponse, ApisauceInstance } from "apisauce";
import AppConfig from "../../Config/AppConfig";
import { IRequestError } from "../../Transforms/ApiError";

interface IUserData {
  challenges_pending: [];
  mail: string;
  username: string;
  show: boolean;
  challenges_to_do: string;
  display_name: string;
  challenges_done: [];
  points: number;
}

const getSelf =
  (api: ApisauceInstance) => async (): Promise<IUserData | undefined> => {
    console.log("la requete est partie lezgo");
    const apiResponse = await api.get<IUserData, IRequestError>("/users/me");

    if (apiResponse.ok) {
      return apiResponse.data;
    }
    return undefined;
  };

export const userApiCalls = (api: ApisauceInstance) => ({
  GET_SELF: getSelf(api),
});
