import { AbstractCard } from "../DataManager";
import React, { useCallback, useState } from "react";
import SubmitButton from "../assets/submit-button.png";
import { PickerProps, CardPickerData } from "../CardPicker";

const URIRegex = `(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)`;

export const ImagePicker: React.FC<PickerProps> = ({ dispatch, onClose }) => {
  const [uri, setUri] = useState("");
  const setURIField = useCallback((e: any) => {
    setUri(e.target.value);
  }, []);
  const dispatchURI = useCallback((url: string) => {}, []);
  const onSubmitURI = useCallback(
    (e: any) => {
      e.preventDefault();
      if (uri.match(URIRegex)) {
        dispatchURI(uri);
        setUri("");
      }
    },
    [dispatchURI, uri]
  );
  return (
    <div>
      <form>
        <input
          type="url"
          pattern={URIRegex}
          value={uri}
          onChange={setURIField}
        />
        <input type="image" src={SubmitButton} style={{ width: "50px" }} />
      </form>
    </div>
  );
};

export const ImageCardData: CardPickerData = {
  icon: "",
  picker: ImagePicker,
};

export interface ImageCard extends AbstractCard {
  kind: "image";
  uri: string;
}

export interface ImageCardProps {
  card: ImageCard;
}

const ImageCardComponent: React.FC<ImageCardProps> = ({ card }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: `url(${card.uri}) cover`,
    }}
  />
);

export default ImageCardComponent;
