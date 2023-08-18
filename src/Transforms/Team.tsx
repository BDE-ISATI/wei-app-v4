export interface ITeamData {
    team: string;
    display_name: string;
    picture_id: string;
    members: string[];
    pending: string[];
    points: number;
};

export interface ITeamUpdateData {
    team: string;
    display_name?: string;
    picture_id?: string;
};