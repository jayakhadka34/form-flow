"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNepaliTyping } from "@/hooks/nepaliTyping";

import { NEPALI_DISTRICTS } from "@/lib/nepali-districts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { z } from "zod";
import { FormDataSchema } from "@/lib/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { fileToBase64 } from "@/lib/fileto-base64";

import "react-datepicker/dist/react-datepicker.css";

import { DOBPicker } from "./ui/datepicker";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import { IssueDatePicker } from "./ui/issuedatepicker";

type Inputs = z.infer<typeof FormDataSchema>;
type FieldName = keyof Inputs;

const parseDate = (value?: string | Date | null) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const parts = value.split("-");
    if (parts.length !== 3) return null;

    const [y, m, d] = parts.map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["fullNameEn", "fullNameNp", "gender", "age"] as FieldName[],
  },
  {
    id: "Step 2",
    name: "Address",
    fields: [
      "citizenshipNumber",
      "issuedDistrict",
      "citizenshipFront",
      "citizenshipBack",
    ] as FieldName[],
  },
  { id: "Step 3", name: "Complete", fields: [] },
];

export default function MultiStepForm() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { text, onChange } = useNepaliTyping();
  const [dobType, setDobType] = React.useState<"BS" | "AD">("AD");
  const [issueDateType, setIssueDateType] = useState<"AD" | "BS">("AD");

  const delta = currentStep - previousStep;

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    mode: "onTouched",
    defaultValues: {
      fullNameEn: "",
      fullNameNp: "",
      gender: "",
      age: "",
      dateOfBirthBS: "",
      dateOfBirthAD: "",
      phoneNumber: "",
      citizenshipNumber: "",
      issuedDistrict: "",
      issueDateAD: "",
      issueDateBS: "",
      citizenshipFront: null,
      citizenshipBack: null,
    },
  });

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    setValue,
    watch,
    setFocus,
    setError,
  } = form;

  const gender = watch("gender");
  const age = watch("age");

  const ageNumber = Number(age);

  const phoneEnabled = !isNaN(ageNumber) && ageNumber > 18 && gender === "male";

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log("FORM DATA:", data);

    setPreviousStep(currentStep);
    setCurrentStep(2);
  };

  React.useEffect(() => {
    if (!phoneEnabled) {
      setValue("phoneNumber", "", {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [phoneEnabled, setValue]);

  const goPrevStep = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const goNextStep = async () => {
    if (currentStep === 0) {
      const age = watch("age");
      const gender = watch("gender");
      const phone = watch("phoneNumber");

      const isValid = await trigger(steps[0].fields, {
        shouldFocus: true,
      });

      if (
        gender === "male" &&
        Number(age) > 18 &&
        (!phone || phone.trim() === "")
      ) {
        setError("phoneNumber", {
          type: "manual",
          message: "Phone number is required for males above 18",
        });
        setFocus("phoneNumber");
        return;
      }

      if (!isValid) return;
    }

    if (currentStep === 1) {
      const isValid = await trigger(steps[1].fields, {
        shouldFocus: true,
      });

      if (!isValid) {
        toast.error("Please complete all document fields");
        return;
      }
    }

    setPreviousStep(currentStep);
    setCurrentStep((step) => step + 1);
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);
  const [backFileType, setBackFileType] = useState<"image" | "pdf" | null>(
    null
  );
  const [backFileName, setBackFileName] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    };
  }, [backPreviewUrl]);

  return (
    <section className="absolute inset-0 flex flex-col justify-between p-24">
      {/* steps */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <Form {...form}>
        <form className="mt-12 py-12" onSubmit={handleSubmit(processForm)}>
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className=" text-2xl font-bold leading-7 text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-l leading-6 text-gray-600">
                Provide your personal details.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Full Name EN */}
                <div className="sm:col-span-3">
                  <FormField
                    control={control}
                    name="fullNameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (English)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Jaya khadka" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={control}
                    name="nepaliFullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (नेपाली)</FormLabel>
                        <FormControl>
                          <Input
                            value={text}
                            placeholder="जया"
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              onChange(rawValue);
                              field.onChange(rawValue);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Gender */}
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

                <div className="sm:col-span-3 mx-16">
                  <FormField
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone Number{" "}
                          {phoneEnabled && (
                            <span className="text-red-500">*</span>
                          )}
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            inputMode="numeric"
                            placeholder="98XXXXXXXX"
                            disabled={!phoneEnabled}
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
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className=" text-2xl font-bold leading-7 text-gray-900">
                Document Information
              </h2>
              <p className="mt-1 text-l leading-6 text-gray-600">
                Provide your Document Details
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
                          <Input
                            type="text"
                            placeholder="Enter citizenship number"
                            {...field}
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
                            {NEPALI_DISTRICTS.map((district) => (
                              <SelectItem
                                key={district}
                                value={district
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}
                              >
                                {district}
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
                    control={form.control}
                    name="citizenshipFront"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Citizenship Front</FormLabel>
                        <FormControl>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.onChange(file);

                              if (!file) return;

                              setFileName(file.name);
                              if (file.type.startsWith("image/")) {
                                setFileType("image");
                                setPreviewUrl(URL.createObjectURL(file));
                              } else {
                                setFileType("pdf");
                                setPreviewUrl(null);
                              }
                            }}
                          />
                        </FormControl>

                        <FormMessage />

                        {fileType && (
                          <div className="mt-3">
                            {fileType === "image" ? (
                              <img
                                src={previewUrl!}
                                alt="Preview"
                                className="h-40 rounded border object-contain"
                              />
                            ) : (
                              <div className="flex items-center gap-2 rounded border p-3">
                                <span className="text-2xl">📄</span>
                                <span>{fileName}</span>
                              </div>
                            )}
                          </div>
                        )}
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
                        <FormLabel>Upload Citizenship Back</FormLabel>

                        <FormControl>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.onChange(file);

                              if (!file) return;

                              setBackFileName(file.name);

                              if (file.type.startsWith("image/")) {
                                setBackFileType("image");
                                setBackPreviewUrl(URL.createObjectURL(file));
                              } else {
                                setBackFileType("pdf");
                                setBackPreviewUrl(null);
                              }
                            }}
                          />
                        </FormControl>

                        <FormMessage />

                        {backFileType && (
                          <div className="mt-3">
                            {backFileType === "image" ? (
                              <img
                                src={backPreviewUrl!}
                                alt="Citizenship Back Preview"
                                className="h-40 rounded border object-contain"
                              />
                            ) : (
                              <div className="flex items-center gap-2 rounded border p-3">
                                <span className="text-2xl">📄</span>
                                <span>{backFileName}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-2xl font-bold leading-7 text-gray-900">
                Complete
              </h2>
              <p className="mt-1 text-l leading-6 text-gray-600">
                Thank you for your submission.
              </p>
            </>
          )}

          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goPrevStep}
                disabled={currentStep === 0}
                className="text-sky-900 ring-sky-300 hover:bg-sky-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </Button>

              {currentStep === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={goNextStep}
                  className="text-sky-900 ring-sky-300 hover:bg-sky-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Button>
              )}

              {currentStep === 1 && (
                <Button
                  type="submit"
                  variant="outline"
                  className="text-sky-900 ring-sky-300 hover:bg-sky-50"
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
