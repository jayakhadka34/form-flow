

import NepaliDate from "nepali-date-converter";


export function adToBs(adDate: string): string {
  if (!adDate) return "";

  const jsDate = new Date(adDate);
  const nepaliDate = new NepaliDate(jsDate);
  return nepaliDate.format("YYYY-MM-DD");
}


export function bsToAd(bsDate: string): string {
  if (!bsDate) return "";

  const nepaliDate = new NepaliDate(bsDate);
  const jsDate = nepaliDate.toJsDate();

  return jsDate.toISOString().split("T")[0];
}


export function calculateAge(adDate: string): number {
  if (!adDate) return 0;

  const dob = new Date(adDate);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
