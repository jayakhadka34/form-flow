"use client";

import { Control, UseFormSetValue } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { adToBs, bsToAd, calculateAge } from "@/lib/date";

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
  const todayAD = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
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
                  max={todayAD} 
                  value={field.value || ""}
                  onChange={(e) => {
                    const ad = e.target.value;
                    field.onChange(ad);

                    if (!ad) return;

                    const bs = adToBs(ad);
                    const age = calculateAge(new Date(ad));

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

      {dobType === "BS" && (
        <FormField
          control={control}
          name="dateOfBirthBS"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth (BS)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="YYYY-MM-DD" 
                  value={field.value || ""}
                  onChange={(e) => {
                    const bs = e.target.value;
                    field.onChange(bs);

                    if (!/^\d{4}-\d{2}-\d{2}$/.test(bs)) return;

                    const adDate = bsToAd(bs);
                    const today = new Date();

                    if (adDate > today) return;

                    const age = calculateAge(adDate);

                    setValue(
                      "dateOfBirthAD",
                      adDate.toISOString().split("T")[0],
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      }
                    );

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
