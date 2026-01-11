"use client";

import { useState, useEffect } from "react";
import CardImage from "@/game/components/CardImage";
import { Card } from "@/game/types/Card";
import { createShuffledDeck, dealHands } from "@/game/utils/deck";
import { getCardMeta } from "@/game/data/cards";
import { canPlayCard } from "@/game/utils/rules";

import "@/app/game.css";

type Turn = "player1" | "player2";

export default function Page() {
  const [player1Hand, setPlayer1Hand] = useState<Card[]>([]);
  const [player2Hand, setPlayer2Hand] = useState<Card[]>([]);
  const [drawPile, setDrawPile] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card | null>(null);
  const [lastPlayedWild, setLastPlayedWild] = useState<Card | null>(null);
  const [turn, setTurn] = useState<Turn>("player1");
  const [log, setLog] = useState<string[]>([]);

  // Her turn için oynama/çekme kontrolü
  const [playedThisTurn, setPlayedThisTurn] = useState(false);
  const [drewThisTurn, setDrewThisTurn] = useState(false);

  /* =========================
     INIT
     ========================= */
  useEffect(() => {
    const deck = createShuffledDeck();
    const { player, npc, remainingDeck } = dealHands(deck);
    setPlayer1Hand(player);
    setPlayer2Hand(npc);
    setDrawPile(remainingDeck);
  }, []);

  /* =========================
     HELPER
     ========================= */
  const canPlay = (card: Card) => {
    if (playedThisTurn) return false; // zaten kart oynadı
    if (!discardPile) return true;

    const topMeta = getCardMeta(discardPile.id);
    const cardMeta = getCardMeta(card.id);
    if (!topMeta || !cardMeta) return false;

    // Wild kart oynandıysa alttaki kart ile kontrol et
    if (lastPlayedWild) {
      return canPlayCard(cardMeta, topMeta);
    }

    return canPlayCard(cardMeta, topMeta);
  };

  const endTurnIfDone = () => {
    if (playedThisTurn || drewThisTurn) {
      setTurn((prev) => (prev === "player1" ? "player2" : "player1"));
      setPlayedThisTurn(false);
      setDrewThisTurn(false);
      setLastPlayedWild(null);
    }
  };

  const playCard = (card: Card, player: "player1" | "player2") => {
    const cardMeta = getCardMeta(card.id);
    if (!cardMeta) return;
    if (!canPlay(card)) return;

    if (cardMeta.type === "wild") {
      setLastPlayedWild(card); // sadece overlay olarak göster
    } else {
      setDiscardPile(card);
      setLastPlayedWild(null);
    }

    setPlayedThisTurn(true);

    if (player === "player1") {
      setPlayer1Hand((prev) => prev.filter((c) => c.id !== card.id));
    } else {
      setPlayer2Hand((prev) => prev.filter((c) => c.id !== card.id));
    }

    // log ekle
    setLog((prev) => [
      `Player ${player === "player1" ? "1" : "2"} -> ${cardMeta.name}`,
      ...prev,
    ]);

    endTurnIfDone();
  };

  const drawCard = (player: "player1" | "player2") => {
    if (drewThisTurn || drawPile.length === 0) return;

    const [drawn, ...rest] = drawPile;
    setDrawPile(rest);

    if (player === "player1") setPlayer1Hand((prev) => [...prev, drawn]);
    else setPlayer2Hand((prev) => [...prev, drawn]);

    setDrewThisTurn(true);

    endTurnIfDone();
  };

  /* =========================
     RENDER
     ========================= */
  const topCard = discardPile;

  return (
    <main className="table">
      {/* Player 2 hand */}
      <section
        className={`hand player2-hand ${
          turn === "player2" ? "active-hand" : ""
        }`}
      >
        <h3 className="text-2xl font-bold">Player 2</h3>
        <div className="flex gap-4 justify-center items-center">
          {player2Hand.map((card) => (
            <CardImage
              key={card.id}
              cardId={card.id}
              playable={turn === "player2" && canPlay(card)}
              onClick={() => turn === "player2" && playCard(card, "player2")}
            />
          ))}
        </div>
      </section>

      {/* Ortadaki draw & discard */}
      <section className="center-area">
        <div className="log-area">
          <h3 className="log-title">Game Log</h3>
          <div className="log-entries">
            {log.map((entry, i) => (
              <div key={i} className="log-entry">
                {entry}
              </div>
            ))}
          </div>
        </div>
        <div className="draw-pile" onClick={() => drawCard(turn)}>
          <CardImage cardId={0} />
        </div>

        <div className="discard-pile" style={{ position: "relative" }}>
          {topCard ? (
            <>
              <CardImage cardId={topCard.id} />
              {lastPlayedWild && <CardImage cardId={lastPlayedWild.id} />}
            </>
          ) : (
            <div className="discard-placeholder">Atılan Kart</div>
          )}
        </div>
      </section>

      {/* Player 1 hand */}
      <section
        className={`hand player1-hand ${
          turn === "player1" ? "active-hand" : ""
        }`}
      >
        <h3 className="text-2xl font-bold">Player 1</h3>
        <div className="flex gap-4 justify-center items-center">
          {player1Hand.map((card) => (
            <CardImage
              key={card.id}
              cardId={card.id}
              playable={turn === "player1" && canPlay(card)}
              onClick={() => turn === "player1" && playCard(card, "player1")}
            />
          ))}
        </div>
      </section>

      <h2>Current Turn: {turn === "player1" ? "Player 1" : "Player 2"}</h2>
    </main>
  );
}
