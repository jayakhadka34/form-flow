"use client";

import { useState } from "react";
import nepalify from "nepalify";

export function useNepaliTyping(initial = "") {
  const [raw, setRaw] = useState("");
  const [text, setText] = useState(initial);

  const onChange = (input: string) => {
    setRaw(input);
    setText(nepalify.format(input));
  };

  return { text, raw, onChange };
}
