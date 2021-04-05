import { getConfig } from "doge-config";

export interface Accounts extends Array<AccountSpec> {
  count: number;
  [index: number]: AccountSpec;
  get(index: number): AccountSpec;
  set(index: number | "count", val: AccountSpec | number): string | boolean;
}

export interface AccountSpec {
  username: string;
  token: string;
  refreshToken: string;
  active: boolean;
  get(prop: string): string | boolean;
  set(prop: string, val: boolean | string): string | boolean;
}

export const accounts: Accounts = getConfig("accounts") as any;

accounts.set("count", Object.keys(accounts).length - 1);
for (let i = 0; i < accounts.count; ++i) {
  accounts.get(i).set("active", false);
}
