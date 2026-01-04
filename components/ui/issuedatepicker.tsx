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

interface IssueDatePickerProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  issueDateType: "BS" | "AD";
  setIssueDateType: (v: "BS" | "AD") => void;
}

export function IssueDatePicker({
  control,
  setValue,
  issueDateType,
  setIssueDateType,
}: IssueDatePickerProps) {
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
          variant={issueDateType === "AD" ? "default" : "outline"}
          onClick={() => setIssueDateType("AD")}
        >
          AD
        </Button>
        <Button
          type="button"
          variant={issueDateType === "BS" ? "default" : "outline"}
          onClick={() => setIssueDateType("BS")}
        >
          BS
        </Button>
      </div>

      {/* AD Input */}
      {issueDateType === "AD" && (
        <FormField
          control={control}
          name="issueDateAD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Date (AD)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => {
                    const ad = e.target.value;
                    field.onChange(ad);

                    const bs = adToBs(ad);
                    setValue("issueDateBS", bs, {
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
      {issueDateType === "BS" && (
        <FormField
          control={control}
          name="issueDateBS"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Date (BS)</FormLabel>
              <FormControl>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={field.value || ""}
                  onChange={(e) => {
                    const bs = e.target.value;
                    field.onChange(bs);

                    const ad = bsToAd(bs);
                    setValue("issueDateAD", ad, {
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
