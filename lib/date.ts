
import NepaliDate from "nepali-date-converter";

export function adToBs(date: Date): string {
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format("YYYY-MM-DD");
}

export function bsToAd(bsDate: string): Date {
  const nepaliDate = new NepaliDate(bsDate);
  return nepaliDate.toJsDate();
}

export function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}
