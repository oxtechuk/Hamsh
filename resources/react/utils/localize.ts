export type LocalizedString = string | Record<string, string>;

export function localize(
  value: any,
  lang: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if ("name" in value && typeof value.name !== "object") return String(value.name);
    if ("name" in value && typeof value.name === "object") return localize(value.name, lang);
    const val = value[lang] ?? value["ar"] ?? value["en"];
    if (typeof val === "string") return val;
    if (val !== undefined && val !== null) return String(val);
    return "";
  }
  return String(value);
}
