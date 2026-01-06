"use client";

import React, { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";

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
  setBackFileType: React.Dispatch<React.SetStateAction<"image" | "pdf" | null>>;
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

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<{
    url: string;
    type: "image" | "pdf";
    title: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    };
  }, [previewUrl, backPreviewUrl]);

  const openPreview = (url: string, type: "image" | "pdf", title: string) => {
    setActivePreview({ url, type, title });
    setIsPreviewOpen(true);
  };

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
                  {!previewUrl ? (
                    <label className="inline-block cursor-pointer rounded border px-4 py-2 text-sm text-sky-700 hover:bg-sky-50">
                      Upload file
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);

                          if (!file) return;

                          const url = URL.createObjectURL(file);
                          setPreviewUrl(url);
                          setFileName(file.name);
                          setFileType(
                            file.type.startsWith("image") ? "image" : "pdf"
                          );
                        }}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="max-w-[180px] truncate text-sm text-gray-700">
                        {fileName}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          openPreview(
                            previewUrl,
                            fileType!,
                            fileName || "Citizenship Front"
                          )
                        }
                        className="rounded border px-3 py-1 text-sm text-sky-700 hover:bg-sky-50"
                      >
                        View
                      </button>
                    </div>
                  )}
                </FormControl>

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
                  {!backPreviewUrl ? (
                    <label className="inline-block cursor-pointer rounded border px-4 py-2 text-sm text-sky-700 hover:bg-sky-50">
                      Upload file
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);

                          if (!file) return;

                          const url = URL.createObjectURL(file);
                          setBackPreviewUrl(url);
                          setBackFileName(file.name);
                          setBackFileType(
                            file.type.startsWith("image") ? "image" : "pdf"
                          );
                        }}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="max-w-[180px] truncate text-sm text-gray-700">
                        {backFileName}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          openPreview(
                            backPreviewUrl,
                            backFileType!,
                            backFileName || "Citizenship Back"
                          )
                        }
                        className="rounded border px-3 py-1 text-sm text-sky-700 hover:bg-sky-50"
                      >
                        View
                      </button>
                    </div>
                  )}
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

     <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle>{activePreview?.title}</DialogTitle>

     
      <DialogDescription className="sr-only">
        Document preview dialog
      </DialogDescription>
    </DialogHeader>

    {activePreview?.type === "image" && (
      <img
        src={activePreview.url}
        alt={activePreview.title}
        className="w-full rounded"
      />
    )}

    {activePreview?.type === "pdf" && (
      <iframe
        src={activePreview.url}
        className="h-[80vh] w-full"
      />
    )}
  </DialogContent>
</Dialog>

    </>
  );
}
