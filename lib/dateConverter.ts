import NepaliDate from "nepali-date-converter"

export function formatAD(date: Date) {
  return date.toISOString().split("T")[0]
}

export function adToBS(ad: Date) {
  const bs = new NepaliDate(ad).getBS()
  return `${bs.year}-${String(bs.month).padStart(2, "0")}-${String(bs.day).padStart(2, "0")}`
}

export function bsToAD(bsString: string) {
  const ad = new NepaliDate(bsString).getAD()
  return new Date(ad.year, ad.month - 1, ad.day)
}
