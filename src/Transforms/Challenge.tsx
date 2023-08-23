import { IUserSmallData } from "./User";

export interface IChallengeData {
  challenge: string;
  picture_id?: string;
  points: number;
  end: number;
  description: string;
  max_count: number;
  name: string;
  start: number;
  users: IUserSmallData[];
}

export interface ICreateChallengeData {
  challenge: string;
  name: string;
  points: number;
  start: number;
  end: number;
  description: string;
  picture_id?: string;
}

export interface IChallengeUpdateData {
  challenge: string;
  picture_id?: string;
  points?: number;
  start?: number;
  end?: number;
  description?: string;
  max_count?: number;
  name?: string;
}
