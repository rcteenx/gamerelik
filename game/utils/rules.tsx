import { CardMeta } from "../types/Card";

export function canPlayCard(selected: CardMeta, topCard: CardMeta): boolean {
  // 🔥 Atılan kart wild ise → her zaman oynanabilir
  if (selected.type === "wild") {
    return true;
  }

  // 🔥 Yerdeki kart wild ise → her kart oynanabilir
  if (topCard.type === "wild") {
    return true;
  }

  // Şimdilik sadece number kartları
  if (selected.type !== "number" || topCard.type !== "number") {
    return false;
  }

  // Aynı sayı
  if (selected.number === topCard.number) {
    return true;
  }

  // Aynı renk
  if (selected.color === topCard.color) {
    return true;
  }

  return false;
}
