import Image from "next/image";

type Props = {
  cardId: number;
  onClick?: () => void;
};

export default function CardImage({ cardId, onClick }: Props) {
  return (
    <Image
      src={`/cards/${cardId}.png`}
      alt={`Card ${cardId}`}
      width={200}
      height={286}
      className="card-image"
      onClick={onClick}
      draggable={false}
    />
  );
}
