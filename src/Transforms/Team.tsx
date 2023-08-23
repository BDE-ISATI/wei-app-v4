import { IUserSmallData } from "./User";

export interface ITeamData {
  team: string;
  display_name: string;
  picture_id: string;
  members: IUserSmallData[];
  pending: string[];
  points: number;
}

export interface ITeamUpdateData {
  team: string;
  display_name?: string;
  picture_id?: string;
}
