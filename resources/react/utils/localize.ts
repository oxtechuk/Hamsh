export type LocalizedString = string | Record<string, string>;

export function localize(
  value: LocalizedString | undefined | null,
  lang: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value["en"] ?? value["ar"] ?? "";
}
