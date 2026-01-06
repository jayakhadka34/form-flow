"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { DOBPicker } from "@/components/ui/datepicker";
import { useNepaliTyping } from "@/hooks/nepaliTyping";
import { Inputs } from "../MultiStepForm";

type PersonalStepProps = {
  form: UseFormReturn<Inputs>;
  dobType: "BS" | "AD";
  setDobType: (v: "BS" | "AD") => void;
};

export function PersonalStep({ form, dobType, setDobType }: PersonalStepProps) {
  const { control, watch, setValue } = form;

  const nepali = useNepaliTyping();

  const gender = watch("gender");
  const age = Number(watch("age"));
  const phoneEnabled = !isNaN(age) && age > 18 && gender === "male";

  React.useEffect(() => {
    if (!phoneEnabled) {
      setValue("phoneNumber", "", {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [phoneEnabled, setValue]);

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 py-12">
        Personal Information
      </h2>
      <p className="-mt-8  text-gray-600 ">Provide your personal details.</p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormField
            control={control}
            name="fullNameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (English)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Jaya Khadka"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <FormField
            control={control}
            name="fullNameNp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (नेपाली)</FormLabel>

                <FormControl>
                  <Input
                    placeholder="जया खड्का"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                        field.onChange(
                          nepali.convertOnSpace(field.value || "")
                        );
                      }
                    }}
                    onBlur={() => {
                      field.onChange(
                        nepali.convertRemainingWord(field.value || "")
                      );
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-4">
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <DOBPicker
            control={control}
            setValue={setValue}
            dobType={dobType}
            setDobType={setDobType}
          />
        </div>
  <div className="sm:col-span-3">
  <FormField
    control={control}
    name="age"
    render={({ field }) => (
      <FormItem>
      
        <FormLabel className="invisible">Age</FormLabel>

        <FormControl>
          <div className="h-12 flex items-center gap-2 text-sm text-gray-900">
            <span className="font-medium">Age :</span>
            <span>{field.value ?? ""}</span>
          </div>
        </FormControl>
      </FormItem>
    )}
  />
</div>



        <div className="sm:col-span-3">
          <FormField
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number{" "}
                  {phoneEnabled && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={!phoneEnabled}
                    placeholder="98XXXXXXXX"
                    inputMode="numeric"
                  />
                </FormControl>
                {phoneEnabled && (
                  <p className="text-xs text-red-500 mt-1">
                    Required for males above 18
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
