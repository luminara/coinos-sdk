import { Config } from "./types";

export abstract class Base {
  private baseUrl: string;
  private authToken: string | undefined;
  private username: string | undefined;
  private password: string | undefined;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl || "https://coinos.io/api";
    this.authToken = config?.authToken;
    this.username = config?.username;
    this.password = config?.password;
  }

  protected async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.authToken) {
      headers["Authorization"] = "Bearer " + this.authToken;
    } else {
      try {
        let response = await (
          await fetch(this.baseUrl + "/login", {
            method: "POST",
            body: JSON.stringify({
              username: this.username,
              password: this.password,
            }),
            headers,
          })
        ).json();

        this.authToken = response.token;
        headers["Authorization"] = "Bearer " + this.authToken;
      } catch {
        throw new Error("Login failed!");
      }
    }

    const config = {
      ...options,
      headers,
    };

    return await (await fetch(url, config)).json();
  }
}
