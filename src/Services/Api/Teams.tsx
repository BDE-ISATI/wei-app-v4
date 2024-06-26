import {ApiResponse, ApisauceInstance} from "apisauce";
import {IResult, ITeamData, ITeamUpdateData} from "../../Transforms";

const getAll =
    (api: ApisauceInstance) =>
        async (force_refresh: boolean = false): Promise<ApiResponse<ITeamData[], IResult>> => {
            const apiResponse = await api.get<ITeamData[], IResult>("/teams" + (force_refresh ? "?force_refresh" : ""));

            return apiResponse;
        };

const getTeam =
    (api: ApisauceInstance) =>
        async (team: string, force_refresh: boolean = false): Promise<ApiResponse<ITeamData, IResult>> => {
            const apiResponse = await api.get<ITeamData, IResult>(`/teams/${team}` + (force_refresh ? "?force_refresh" : ""));

            return apiResponse;
        };

const joinTeam =
    (api: ApisauceInstance) =>
        async (team: string): Promise<ApiResponse<IResult>> => {
            const apiResponse = await api.post<IResult>(`/teams/${team}/join`);

            return apiResponse;
        };

const leaveTeam =
    (api: ApisauceInstance) => async (): Promise<ApiResponse<IResult>> => {
        const apiResponse = await api.post<IResult>(`/teams/leave`);

        return apiResponse;
    };

const createTeam =
    (api: ApisauceInstance) =>
        async (teamData: ITeamUpdateData): Promise<ApiResponse<IResult>> => {
            const apiResponse = await api.put<IResult>(
                `/teams/${teamData.team}`,
                teamData
            );

            return apiResponse;
        };

const updateTeam =
    (api: ApisauceInstance) =>
        async (teamData: ITeamUpdateData): Promise<ApiResponse<IResult>> => {
            const apiResponse = await api.post<IResult>(
                `/teams/${teamData.team}`,
                teamData
            );

            return apiResponse;
        };

const acceptJoinTeam =
    (api: ApisauceInstance) =>
        async (username: string, team: string, deny: boolean = false): Promise<ApiResponse<IResult>> => {
            const apiResponse = await api.post<IResult>(`/teams/${team}/accept${deny ? "?deny" : ""}`, {
                username: username,
            });

            return apiResponse;
        };

export const teamApiCalls = (api: ApisauceInstance) => ({
    GET_ALL_TEAMS: getAll(api),
    GET_TEAM: getTeam(api),
    JOIN_TEAM: joinTeam(api),
    LEAVE_TEAM: leaveTeam(api),
    CREATE_TEAM: createTeam(api),
    UPDATE_TEAM: updateTeam(api),
    ACCEPT_JOIN_TEAM: acceptJoinTeam(api),
});
