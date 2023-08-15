export interface IChallengeData {
  challenge: string,
  picture_id?: string,
  points: number,
  end: number,
  description: string,
  max_count: number,
  name: string,
  start: number
}

export interface IChallengeUpdateData {
  challenge: string,
  picture_id?: string,
  points?: number,
  start?: number,
  end?: number,
  description?: number,
  max_count?: number,
  name?: number
}