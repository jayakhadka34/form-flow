import NepaliDate from "nepali-date-converter";

// helper
const pad = (num: number) => String(num).padStart(2, "0");

// Convert BS → AD
export const convertBSToAD = (bs: string) => {
  try {
    const [year, month, day] = bs.split("-").map(Number);
    const adDate = NepaliDate.BS2AD(year, month, day);

    return `${adDate.year}-${pad(adDate.month)}-${pad(adDate.day)}`;
  } catch {
    return "";
  }
};

// Convert AD → BS
export const convertADToBS = (ad: string) => {
  try {
    const [year, month, day] = ad.split("-").map(Number);
    const bsDate = NepaliDate.AD2BS(year, month, day);

    return `${bsDate.year}-${pad(bsDate.month)}-${pad(bsDate.day)}`;
  } catch {
    return "";
  }
};
