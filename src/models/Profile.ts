export interface Profile {
  id: string;
  username: string;
  avatar: string;
  ispublic: boolean;
  country: number | null;
  created_at: Date;
}

export interface ProfileUpdate {
  id: string;
  username?: string;
  ispublic?: boolean;
  country?: number | null;
  avatar?: string | null;
}
