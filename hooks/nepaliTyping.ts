import nepalify from "nepalify"

export function useNepaliTyping() {
  const convertOnSpace = (value: string) => {
    const words = value.split(" ")
    const lastWord = words.pop() || ""

    if (!lastWord) return value + " "

    const converted = nepalify.format(lastWord)

    return words.length > 0
      ? words.join(" ") + " " + converted + " "
      : converted + " "
  }

  const convertRemainingWord = (value: string) => {
    const words = value.split(" ")
    const lastWord = words.pop() || ""

    if (!lastWord) return value

    const converted = nepalify.format(lastWord)

    return words.length > 0
      ? words.join(" ") + " " + converted
      : converted
  }

  return {
    convertOnSpace,
    convertRemainingWord,
  }
}
