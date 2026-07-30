import type { ICarHighlightResult } from "../interfaces/ICarHighlightResult";

export function resolveHighlight(
  value: unknown,
  locale: string,
): ICarHighlightResult | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value ? { text: value } : undefined;
  }

  if (typeof value === "object" && value !== null) {
    const objectValue = value as Record<string, unknown>;

    const languageKey = locale.startsWith("ar") ? "text_ar" : "text";

    const text = String(
      objectValue[languageKey] ?? objectValue.text_ar ?? objectValue.text ?? "",
    );

    if (!text) {
      return undefined;
    }

    return {
      text,
      color:
        typeof objectValue.color === "string" ? objectValue.color : undefined,
    };
  }

  return {
    text: String(value),
  };
}

export function contrastTextColor(color?: string): string {
  if (!color) {
    return "#ffffff";
  }

  const normalizedColor = color.replace("#", "");

  if (normalizedColor.length !== 6) {
    return "#ffffff";
  }

  const red = Number.parseInt(normalizedColor.substring(0, 2), 16);
  const green = Number.parseInt(normalizedColor.substring(2, 4), 16);
  const blue = Number.parseInt(normalizedColor.substring(4, 6), 16);

  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    return "#ffffff";
  }

  const brightness = red * 0.299 + green * 0.587 + blue * 0.114;

  return brightness > 186 ? "#111827" : "#ffffff";
}
