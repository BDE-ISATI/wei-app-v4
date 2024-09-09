import {IUserStateImmutable} from "../Reducers/User";

export interface IUserData {
    picture_id?: string;
    challenges_pending: string[];
    mail: string;
    username: string;
    show: boolean;
    challenges_to_do: string;
    display_name: string;
    challenges_done: string[];
    challenges_times: { [key: string]: number };
    points: number;
    is_admin?: boolean;
    anecdote: string;
    anecdoteSelected?: string;
    scoreAnecdote?:number;
}

export const reduceUserData = (data: IUserData | IUserStateImmutable) => {
    let smallUserData: IUserSmallData = {
        username: data.username,
        display_name: data.display_name,
        picture_id: data.picture_id,
    };
    return smallUserData;
};

export interface IUserSmallData {
    username: string;
    display_name: string;
    picture_id?: string;
    points?: number;
    time?: number;
}

export interface IUserUpdateData {
    show?: boolean;
    display_name?: string;
    picture_id?: string;
    anecdote?:string;
    scoreAnecdote?:number
}
