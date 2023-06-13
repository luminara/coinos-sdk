export type Config = {
  authToken?: string;
  username?: string;
  password?: string;
  baseUrl?: string;
} & (
  | { authToken: string; username?: never; password?: never }
  | { authToken?: never; username: string; password: string }
);
