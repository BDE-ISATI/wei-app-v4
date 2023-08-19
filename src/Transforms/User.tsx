export interface IUserData {
    picture_id?: string;
    challenges_pending: [];
    mail: string;
    username: string;
    show: boolean;
    challenges_to_do: string;
    display_name: string;
    challenges_done: [];
    points: number;
}

export interface IUserUpdateData {
    username: string;
    show?: boolean;
    display_name?: string;
    picture_id?: string;
}