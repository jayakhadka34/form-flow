"use client";

import { Control, UseFormSetValue } from "react-hook-form";
import NepaliDate from "nepali-date-converter";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DOBPickerProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  dobType: "BS" | "AD";
  setDobType: (v: "BS" | "AD") => void;
}

export function DOBPicker({
  control,
  setValue,
  dobType,
  setDobType,
}: DOBPickerProps) {
  const calculateAge = (ad: string) => {
    const dob = new Date(ad);
    if (isNaN(dob.getTime())) return undefined;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  const adToBs = (ad: string) =>
    new NepaliDate(new Date(ad)).format("YYYY-MM-DD");

  const bsToAd = (bs: string) =>
    new NepaliDate(bs).toJsDate().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={dobType === "AD" ? "default" : "outline"}
          onClick={() => setDobType("AD")}
        >
          AD
        </Button>
        <Button
          type="button"
          variant={dobType === "BS" ? "default" : "outline"}
          onClick={() => setDobType("BS")}
        >
          BS
        </Button>
      </div>

      {/* AD Input */}
      {dobType === "AD" && (
        <FormField
          control={control}
          name="dateOfBirthAD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (AD)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => {
                    const ad = e.target.value;
                    field.onChange(ad);

                    const bs = adToBs(ad);
                    const age = calculateAge(ad);

                    setValue("dateOfBirthBS", bs, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    setValue("age", age, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* BS Input */}
      {dobType === "BS" && (
        <FormField
          control={control}
          name="dateOfBirthBS"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (BS)</FormLabel>
              <FormControl>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={field.value || ""}
                  onChange={(e) => {
                    const bs = e.target.value;
                    field.onChange(bs);

                    const ad = bsToAd(bs);
                    const age = calculateAge(ad);

                    setValue("dateOfBirthAD", ad, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    setValue("age", age, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
