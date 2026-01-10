import { Card } from "../types/Card";
import { shuffleDeck } from "./shuffle";

interface DealResult {
  playerHand: Card[];
  npcHand: Card[];
  remainingDeck: Card[];
}

export function dealOpeningCards(deck: Card[]): DealResult {
  const shuffledDeck = shuffleDeck(deck);

  const playerHand = shuffledDeck.slice(0, 5);
  const npcHand = shuffledDeck.slice(5, 10);
  const remainingDeck = shuffledDeck.slice(10);

  return {
    playerHand,
    npcHand,
    remainingDeck,
  };
}
