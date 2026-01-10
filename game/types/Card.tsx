export type CardColor =
  | "orange"
  | "yellow"
  | "blue"
  | "grey"
  | "green"
  | "wild";

export type CardType = "number" | "wild" | "reverse" | "draw2" | "wild";

export type CardMeta = {
  id: number;
  number: number;
  color: CardColor;
  type: CardType;
};
