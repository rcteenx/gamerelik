import { Card } from "../types/Card";

interface DealResult {
  playerHand: Card[];
  npcHand: Card[];
  deck: Card[];
}

export function dealOpeningCards(shuffledDeck: Card[]): DealResult {
  const deck = [...shuffledDeck];

  const playerHand = deck.splice(0, 5);
  const npcHand = deck.splice(0, 5);

  return {
    playerHand,
    npcHand,
    deck,
  };
}
