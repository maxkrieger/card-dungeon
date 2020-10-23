import { AbstractCard } from "../DataManager";

export interface ImageCard extends AbstractCard {
  kind: "image";
    uri: string;
}

export interface ImageCardProps {
    card: ImageCard;
}