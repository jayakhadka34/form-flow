"use client";

import React, { useEffect } from "react";
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

import { NEPALI_DISTRICTS } from "@/lib/nepali-districts";
import { IssueDatePicker } from "@/components/ui/issuedatepicker";
import { Inputs } from "../form.types";

type PreviewState = {
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  fileType: "image" | "pdf" | null;
  setFileType: React.Dispatch<React.SetStateAction<"image" | "pdf" | null>>;
  fileName: string | null;
  setFileName: React.Dispatch<React.SetStateAction<string | null>>;

  backPreviewUrl: string | null;
  setBackPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  backFileType: "image" | "pdf" | null;
  setBackFileType: React.Dispatch<
    React.SetStateAction<"image" | "pdf" | null>
  >;
  backFileName: string | null;
  setBackFileName: React.Dispatch<React.SetStateAction<string | null>>;
};

type DocumentStepProps = {
  form: UseFormReturn<Inputs>;
  issueDateType: "BS" | "AD";
  setIssueDateType: (v: "BS" | "AD") => void;
  previewState: PreviewState;
};

export function DocumentStep({
  form,
  issueDateType,
  setIssueDateType,
  previewState,
}: DocumentStepProps) {
  const { control, setValue } = form;

  const {
    previewUrl,
    setPreviewUrl,
    fileType,
    setFileType,
    fileName,
    setFileName,
    backPreviewUrl,
    setBackPreviewUrl,
    backFileType,
    setBackFileType,
    backFileName,
    setBackFileName,
  } = previewState;

  // cleanup object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    };
  }, [previewUrl, backPreviewUrl]);

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 py-12">
        Document Information
      </h2>
      <p className="-mt-8 text-gray-600">
        Provide your citizenship document details.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
       
        <div className="sm:col-span-3">
          <FormField
            control={control}
            name="citizenshipNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citizenship Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        
        <div className="sm:col-span-3">
          <FormField
            control={control}
            name="issuedDistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issued District</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NEPALI_DISTRICTS.map((d) => (
                      <SelectItem
                        key={d}
                        value={d.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        
        <div className="sm:col-span-3">
          <IssueDatePicker
            control={control}
            setValue={setValue}
            issueDateType={issueDateType}
            setIssueDateType={setIssueDateType}
          />
        </div>

       
        <div className="sm:col-span-3">
          <FormField
            control={control}
            name="citizenshipFront"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citizenship Front</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      field.onChange(file);

                      if (!file) return;

                      setFileName(file.name);

                      if (file.type.startsWith("image")) {
                        const url = URL.createObjectURL(file);
                        setPreviewUrl(url);
                        setFileType("image");
                      } else {
                        setFileType("pdf");
                      }
                    }}
                  />
                </FormControl>

                {previewUrl && fileType === "image" && (
                  <img
                    src={previewUrl}
                    alt="Front Preview"
                    className="mt-2 h-32 rounded border"
                  />
                )}

                {fileType === "pdf" && (
                  <p className="mt-2 text-sm text-gray-600">
                    {fileName}
                  </p>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <FormField
            control={control}
            name="citizenshipBack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citizenship Back</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      field.onChange(file);

                      if (!file) return;

                      setBackFileName(file.name);

                      if (file.type.startsWith("image")) {
                        const url = URL.createObjectURL(file);
                        setBackPreviewUrl(url);
                        setBackFileType("image");
                      } else {
                        setBackFileType("pdf");
                      }
                    }}
                  />
                </FormControl>

                {backPreviewUrl && backFileType === "image" && (
                  <img
                    src={backPreviewUrl}
                    alt="Back Preview"
                    className="mt-2 h-32 rounded border"
                  />
                )}

                {backFileType === "pdf" && (
                  <p className="mt-2 text-sm text-gray-600">
                    {backFileName}
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
