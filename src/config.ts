import { Config, getConfig } from "doge-config";

export interface KoreanConfig extends Config {
  room: string;
}

export const config = getConfig("korean");
