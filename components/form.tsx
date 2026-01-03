"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";


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
import { FormDataSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";



import "react-datepicker/dist/react-datepicker.css";



import { DOBPicker } from "./ui/dob-picker";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css"; 

type Inputs = z.infer<typeof FormDataSchema>;

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
    fields: ["fullNameEn", "fullNameNp", "gender"],
  },
  {
    id: "Step 2",
    name: "Address",
    fields: [
      "citizenshipNumber",
      "issuedDistrict",
      "issuedDate",
      "citizenshipFront",
      "citizenshipBack",
    ],
  },
  { id: "Step 3", name: "Complete" },
];

export default function MultiStepForm() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [dobType, setDobType] = React.useState<'BS' | 'AD'>('AD')

  const delta = currentStep - previousStep;

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    mode: "onTouched",
      defaultValues: {
        fullNameEn: "",
    fullNameNp: "",
    gender: "",
    dateOfBirthBS: "",
    dateOfBirthAD: "",
    phoneNumber: "",
  },
  });
  const { control, handleSubmit, trigger, reset, setValue, getValues } = form;
  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

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

                {/* Full Name NP */}
                <div className="sm:col-span-3">
                  <FormField
                    control={control}
                    name="fullNameNp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (Nepali)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="जया खड्का"
                            autoCorrect="off"
                            autoCapitalize="off"
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
                          value={field.value}
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
    getValues={getValues}
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
        <FormLabel>Phone Number</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="text" inputMode="numeric"
            placeholder="98XXXXXXXX"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </FormControl>
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
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Address
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Address where you can receive mail.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Citizenship Number
                  </label>
                  <div className="mt-2">
                    <select
                      id="citizenshipNumber"
                      {...register("citizenshipNumber")}
                      autoComplete="country-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                    {errors.citizenshipNumber?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.citizenshipNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Issued District
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="issuedDistrict"
                      {...register("issuedDistrict")}
                      autoComplete="issuedDistrict"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.issuedDistrict?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.issuedDistrict.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="issuedDate"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Issued Date
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="issuedDate"
                      {...register("issuedDate")}
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.issuedDate?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.issuedDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Upload Citizenship Front
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="citizenshipFront"
                      {...register("citizenshipFront")}
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.citizenshipFront?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {/* {errors.citizenshipFront.message} */}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="zip"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Upload Citizenship Back
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="citizenshipBack"
                      {...register("citizenshipBack")}
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.citizenshipBack?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {/* {errors.citizenshipBack.message} */}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Complete
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Thank you for your submission.
              </p>
            </>
          )}
        </form>
      </Form>
      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          </button>
        </div>
      </div>
    </section>
  );
}
