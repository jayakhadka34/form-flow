import { useState } from "react"
import nepalify from "nepalify"

export function useNepaliTyping(initial = "") {
  const [value, setValue] = useState(initial)

  
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === " ") {
      e.preventDefault()

      const words = value.split(" ")
      const lastWord = words.pop() || ""

      if (!lastWord) return

      const converted = nepalify.format(lastWord)

      const updated =
        words.length > 0
          ? words.join(" ") + " " + converted + " "
          : converted + " "

      setValue(updated)
    }
  }


  const convertRemainingWord = () => {
    const words = value.split(" ")
    const lastWord = words.pop() || ""

    if (!lastWord) return

    const converted = nepalify.format(lastWord)

    const updated =
      words.length > 0
        ? words.join(" ") + " " + converted
        : converted

    setValue(updated)
  }

  return {
    value,
    setValue,
    handleKeyDown,
    convertRemainingWord, 
  }
}
