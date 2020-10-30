import React, { useCallback, useState } from "react";
import styled from "styled-components";
import SubmitButton from "./assets/submit-button.png";
import { BORDER_PRIMARY_COLOR, BORDER_SECONDARY_COLOR } from "./colors";
const NameInput = styled.input`
  font-family: "Alagard", sans-serif;
  font-size: 2em;
  color: ${BORDER_PRIMARY_COLOR};
  background-color: ${BORDER_SECONDARY_COLOR};
  border: none;
  border-radius: 10px;
  outline: none;
  padding: 10px 20px 10px 20px;
  transition: 0.1s;
  &:focus {
    transition: 0.1s;
    box-shadow: 0px 0px 5px 5px rgba(189, 135, 0, 1);
  }
`;

const TextInputForm: React.FC<{
  onSubmit(content: string): void;
  maxLength: number;
  placeholder: string;
  regex: string | null;
  keepOnSubmit?: boolean;
}> = ({ onSubmit, maxLength, placeholder, regex, keepOnSubmit }) => {
  const [fieldValue, setFieldValue] = useState("");
  const onSubmitField = useCallback(
    (e: any) => {
      e.preventDefault();
      if (regex) {
        if (fieldValue.match(regex)) {
          onSubmit(fieldValue);
          if (!keepOnSubmit) {
            setFieldValue("");
          }
        }
      } else {
        onSubmit(fieldValue);
        if (!keepOnSubmit) {
          setFieldValue("");
        }
      }
      return false;
    },
    [regex, fieldValue, onSubmit]
  );
  return (
    <form
      onSubmit={onSubmitField}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <NameInput
        type={regex !== null ? "url" : "text"}
        value={fieldValue}
        maxLength={maxLength}
        onChange={(e: any) => setFieldValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={true}
        pattern={regex || undefined}
      />
      <input
        type="image"
        src={SubmitButton}
        style={{
          outline: "none",
          width: "96px",
          height: "66px",
          // display: "inline-block",
          border: 0,
        }}
        alt="submit"
      />
    </form>
  );
};

export default TextInputForm;
