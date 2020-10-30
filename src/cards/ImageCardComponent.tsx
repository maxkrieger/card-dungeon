import { AbstractCard, gordonId } from "../DataManager";
import React, { createRef, useCallback, useEffect, useState } from "react";
import SubmitButton from "../assets/submit-button.png";
import { PickerProps, CardPickerData } from "../CardPicker";
import ImageCardIcon from "../assets/imageimages/image_0000.png";
import ImageIcon from "../assets/imageicon.png";
import { dataManager } from "../App";
import TextInputForm from "../TextInputForm";
import { BORDER_PRIMARY_COLOR } from "../colors";
import { sample } from "lodash";
const giphy = require("giphy-api")(process.env.REACT_APP_GIPHY_API_KEY || "");

const URIRegex = `(http(s?):).*\.(?:jpe?g|gif|png|svg|webp)`;

export const ImagePicker: React.FC<PickerProps> = ({ dispatch, onClose }) => {
  const fileInput = createRef<HTMLInputElement>();

  const dispatchURI = useCallback(
    (url: string, title: string = "photo") => {
      const img = new Image();
      img.onerror = (err: any) => {
        onClose();
        console.error(err);
      };
      img.onload = () => {
        // https://stackoverflow.com/a/14731922
        const ratio = Math.min(300 / img.width, 200 / img.height);
        dataManager.addCard({
          kind: "image",
          title: title,
          icon: ImageIcon,
          uri: url,
          x: 0,
          y: 0,
          w: img.width * ratio,
          h: img.height * ratio + 20,
          id: gordonId(),
          author: dataManager.getMe().id,
          manager: dataManager.getMe().id,
          trashed: false,
        });
      };
      img.src = url;

      onClose();
    },
    [onClose]
  );
  const onSubmitFile = useCallback(() => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        dispatchURI(reader.result as string);
      },
      false
    );
    if (
      fileInput.current &&
      fileInput.current.files &&
      fileInput.current!.files!.length > 0
    ) {
      const first = fileInput.current.files[0];
      reader.readAsDataURL(first);
    }
  }, [dispatchURI, fileInput]);
  const onGiphy = useCallback(
    (query: string) => {
      (async () => {
        try {
          const { data } = await giphy.search(query);
          const elem = sample(data);
          dispatchURI(elem.images.downsized_medium.url, `${query}.gif`);
        } catch (err) {
          console.log(`gif search for ${query} failed`, err);
        }
      })();
    },
    [dispatchURI]
  );
  useEffect(() => {
    if (fileInput.current) {
      fileInput.current.onchange = onSubmitFile;
    }
  }, [fileInput, onSubmitFile]);
  return (
    <div
      style={{
        color: BORDER_PRIMARY_COLOR,
      }}
    >
      <TextInputForm
        maxLength={800}
        onSubmit={dispatchURI}
        placeholder={"image url"}
        regex={URIRegex}
      />
      <TextInputForm
        maxLength={800}
        onSubmit={onGiphy}
        placeholder={"gif search"}
        regex={null}
      />
      <hr style={{ borderColor: BORDER_PRIMARY_COLOR }} />
      <div style={{ fontFamily: "Alagard", fontSize: "2em" }}>
        <label>
          upload your own:{" "}
          <input
            type="file"
            ref={fileInput}
            multiple={false}
            accept={".jpg,.jpeg,.gif,.png,.svg"}
          />
        </label>
      </div>
    </div>
  );
};

export const ImageCardData: CardPickerData = {
  icon: ImageCardIcon,
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
      backgroundImage: `url(${card.uri})`,
      backgroundSize: `cover`,
    }}
  />
);

export default ImageCardComponent;
