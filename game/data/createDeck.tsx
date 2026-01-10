import { Card } from "../types/card";

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (let i = 1; i <= 80; i++) {
    deck.push({
      id: i,
      color: "red", // şimdilik önemsiz
      value: i, // placeholder
    });
  }

  return deck;
}
