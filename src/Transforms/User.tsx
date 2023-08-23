import { IUserStateImmutable } from "../Reducers/User";

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

export const reduceUserData = (data: IUserData | IUserStateImmutable) => {
  let smallUserData: IUserSmallData = {
    username: data.username,
    picture_id: data.picture_id,
  };
  return smallUserData;
};

export interface IUserSmallData {
  username: string;
  picture_id?: string;
}

export interface IUserUpdateData {
  show?: boolean;
  display_name?: string;
  picture_id?: string;
}
