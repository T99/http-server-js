export type JSONLiteral = true | false | null;
export type JSONMap = { [key: string]: JSONObject };
export type JSONArray = JSONObject[];
export type JSONObject = JSONMap | JSONArray | number | string | JSONLiteral;
