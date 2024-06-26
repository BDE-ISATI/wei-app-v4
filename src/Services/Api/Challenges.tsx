import {ApiResponse, ApisauceInstance} from "apisauce";
import {IChallengeData, IChallengeUpdateData, IResult,} from "../../Transforms";
import {ICreateChallengeData} from "../../Transforms/Challenge";

const getAll =
    (api: ApisauceInstance) =>
        async (
            force_refresh: boolean = false
        ): Promise<ApiResponse<IChallengeData[], IResult>> => {
            const apiResponse = await api.get<IChallengeData[], IResult>(
                "/challenges" + (force_refresh ? "?force_refresh" : "")
            );

            return apiResponse;
        };

const getChallenge =
    (api: ApisauceInstance) =>
        async (
            challenge: string,
            force_refresh: boolean = false
        ): Promise<ApiResponse<IChallengeData, IResult>> => {
            const apiResponse = await api.get<IChallengeData, IResult>(
                `/challenges/${challenge}` + (force_refresh ? "?force_refresh" : "")
            );

            return apiResponse;
        };

const requestChallenge =
    (api: ApisauceInstance) =>
        async (challenge: string): Promise<ApiResponse<IResult>> => {
            const apiResponse = await api.post<IResult>(
                `/challenges/${challenge}/request`
            );

            return apiResponse;
        };

const createChallenge =
    (api: ApisauceInstance) =>
        async (
            challengeData: ICreateChallengeData
        ): Promise<ApiResponse<IResult>> => {
            const apiResponse = await api.put<IResult>(
                `/challenges/${challengeData.challenge}`,
                challengeData
            );

            return apiResponse;
        };

const updateChallenge =
    (api: ApisauceInstance) =>
        async (
            challengeData: IChallengeUpdateData
        ): Promise<ApiResponse<IResult>> => {
            const apiResponse = await api.post<IResult>(
                `/challenges/${challengeData.challenge}`,
                {
                    name: challengeData.name,
                    description: challengeData.description,
                    points: challengeData.points,
                    start: challengeData.start,
                    end: challengeData.end,
                    picture_id: challengeData.picture_id,
                    max_count: challengeData.max_count,
                }
            );

            return apiResponse;
        };

const acceptChallengeRequest =
    (api: ApisauceInstance) =>
        async (
            username: string,
            challenge: string,
            deny: boolean = false
        ): Promise<ApiResponse<IResult>> => {
            const apiResponse = await api.post<IResult>(`/users/${username}/accept${deny ? "?deny" : ""}`, {
                challenge: challenge,
            });

            return apiResponse;
        };
export const challengeApiCalls = (api: ApisauceInstance) => ({
    GET_ALL_CHALLENGES: getAll(api),
    GET_CHALLENGE: getChallenge(api),
    REQUEST_CHALLENGE: requestChallenge(api),
    CREATE_CHALLENGE: createChallenge(api),
    UPDATE_CHALLENGE: updateChallenge(api),
    ACCEPT_CHALLENGE_REQUEST: acceptChallengeRequest(api),
});
