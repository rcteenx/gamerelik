import cards from "./cards.json";
import { CardMeta } from "../types/Card";

export const CARD_DATA = cards as CardMeta[];

export function getCardMeta(id: number): CardMeta | undefined {
  return CARD_DATA.find((card) => card.id === id);
}
