export type Card = {
  id: number;
};

/* 1 – 80 arası kartlar */
export function createShuffledDeck(): Card[] {
  const deck: Card[] = [];

  for (let i = 1; i <= 80; i++) {
    deck.push({ id: i });
  }

  // Fisher–Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

/* Oyunculara 5’er kart dağıt */
export function dealHands(deck: Card[]) {
  const player = deck.slice(0, 5);
  const npc = deck.slice(5, 10);
  const remainingDeck = deck.slice(10);

  return {
    player,
    npc,
    remainingDeck,
  };
}
