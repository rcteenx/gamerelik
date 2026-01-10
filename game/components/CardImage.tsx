import Image from "next/image";

type Props = {
  cardId: number;
  playable?: boolean;
  onClick?: () => void;
};

export default function CardImage({ cardId, playable = true, onClick }: Props) {
  return (
    <img
      src={`/cards/${cardId}.png`}
      className={`card-image ${playable ? "playable" : "disabled"}`}
      onClick={playable ? onClick : undefined}
      draggable={false}
    />
  );
}
