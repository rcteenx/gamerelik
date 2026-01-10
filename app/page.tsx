"use client";

import { useEffect, useRef, useState } from "react";
import CardImage from "@/game/components/CardImage";
import { createShuffledDeck, dealHands, Card } from "@/game/utils/deck";
import { getCardMeta } from "@/game/data/cards";
import { canPlayCard } from "@/game/utils/rules";
import "@/app/game.css";

type Turn = "player" | "npc";

export default function Page() {
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [npcHand, setNpcHand] = useState<Card[]>([]);
  const [drawPile, setDrawPile] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card | null>(null);
  const [turn, setTurn] = useState<Turn>("player");

  // 🔒 NPC bir turda sadece 1 kez çalışsın
  const npcProcessingRef = useRef(false);

  /* =========================
     INIT
     ========================= */
  useEffect(() => {
    const deck = createShuffledDeck();
    const { player, npc, remainingDeck } = dealHands(deck);

    setPlayerHand(player);
    setNpcHand(npc);
    setDrawPile(remainingDeck);
  }, []);

  /* =========================
     NPC TURN EFFECT (CRITICAL)
     ========================= */
  useEffect(() => {
    if (turn !== "npc") return;
    if (npcProcessingRef.current) return;

    npcProcessingRef.current = true;

    const timer = setTimeout(() => {
      playNpcTurn();
      npcProcessingRef.current = false;
    }, 600);

    return () => clearTimeout(timer);
  }, [turn, npcHand, drawPile, discardPile]);

  /* =========================
     PLAYER PLAY
     ========================= */
  const handlePlayerCardClick = (card: Card) => {
    if (turn !== "player") return;

    if (!discardPile) {
      setDiscardPile(card);
      setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));
      return;
    }

    const selected = getCardMeta(card.id);
    const top = getCardMeta(discardPile.id);
    if (!selected || !top) return;

    if (!canPlayCard(selected, top)) return;

    setDiscardPile(card);
    setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));
  };

  /* =========================
     PLAYER DRAW
     ========================= */
  const handleDrawCard = () => {
    if (turn !== "player") return;
    if (drawPile.length === 0) return;

    const drawn = drawPile[0];
    setDrawPile((prev) => prev.slice(1));
    setPlayerHand((prev) => [...prev, drawn]);
  };

  /* =========================
     END TURN
     ========================= */
  const handleEndTurn = () => {
    if (turn !== "player") return;
    setTurn("npc");
  };

  /* =========================
     NPC LOGIC (STATE SAFE)
     ========================= */
  const playNpcTurn = () => {
    if (!discardPile) {
      setTurn("player");
      return;
    }

    const topMeta = getCardMeta(discardPile.id);
    if (!topMeta) {
      setTurn("player");
      return;
    }

    let newNpcHand = [...npcHand];
    let newDrawPile = [...drawPile];

    // 1️⃣ Elden oyna
    const index = newNpcHand.findIndex((card) => {
      const meta = getCardMeta(card.id);
      return meta && canPlayCard(meta, topMeta);
    });

    if (index !== -1) {
      const played = newNpcHand.splice(index, 1)[0];
      setNpcHand(newNpcHand);
      setDiscardPile(played);
      setTurn("player");
      return;
    }

    // 2️⃣ Çek
    if (newDrawPile.length === 0) {
      setTurn("player");
      return;
    }

    const drawn = newDrawPile.shift()!;
    const drawnMeta = getCardMeta(drawn.id);

    if (drawnMeta && canPlayCard(drawnMeta, topMeta)) {
      setDiscardPile(drawn);
    } else {
      setNpcHand([...newNpcHand, drawn]);
    }

    setDrawPile(newDrawPile);
    setTurn("player");
  };

  /* =========================
     RENDER
     ========================= */
  return (
    <main className="table">
      <section className="hand npc-hand">
        {npcHand.map((card) => (
          <CardImage key={card.id} cardId={card.id} />
        ))}
      </section>

      <section className="center-area">
        <div className="draw-pile" onClick={handleDrawCard}>
          <CardImage cardId={0} />
        </div>

        <div className="discard-pile">
          {discardPile ? (
            <CardImage cardId={discardPile.id} />
          ) : (
            <div className="discard-placeholder">Atılan Kart</div>
          )}
        </div>
      </section>

      <section className="hand player-hand">
        {playerHand.map((card) => (
          <CardImage
            key={card.id}
            cardId={card.id}
            onClick={() => handlePlayerCardClick(card)}
          />
        ))}
      </section>

      <div className="end-turn-area">
        <button
          className="end-turn-button"
          onClick={handleEndTurn}
          disabled={turn !== "player"}
        >
          End Turn
        </button>
      </div>
    </main>
  );
}
