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

import { adToBs, bsToAd } from "@/lib/date";

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
 
  const todayAD = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
 
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
                  max={todayAD} 
                  value={field.value || ""}
                  onChange={(e) => {
                    const ad = e.target.value;
                    field.onChange(ad);

                    if (!ad) return;

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

     
      {issueDateType === "BS" && (
        <FormField
          control={control}
          name="issueDateBS"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Date (BS)</FormLabel>
              <FormControl>
                <Input
                  type="text" className="text-right"
                  placeholder="YYYY-MM-DD"
                  value={field.value || ""}
                  onChange={(e) => {
                    const bs = e.target.value;
                    field.onChange(bs);

                    
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(bs)) return;

                    const adDate = bsToAd(bs);
                    const today = new Date();

                  
                    if (adDate > today) return;

                    setValue(
                      "issueDateAD",
                      adDate.toISOString().split("T")[0],
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      }
                    );
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
