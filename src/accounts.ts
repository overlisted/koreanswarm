import { readFileSync } from "fs";

export type Account = {
  token: string;
  refreshToken: string;
};

export default JSON.parse(
  readFileSync("./config/accounts.json", "utf8")
) as Account[];
