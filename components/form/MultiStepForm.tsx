"use client";

import { useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { FormDataSchema } from "@/lib/schemas/schema";
import { Stepper } from "./Stepper";
import { PersonalStep } from "./steps/PersonalStep";
import { DocumentStep } from "./steps/DocumentStep";
import { CompleteStep } from "./steps/CompleteStep";
import { Button } from "../ui/button";
import { z } from "zod";
import toast from "react-hot-toast";
import { fileToBase64 } from "@/lib/fileto-base64";

export type Inputs = z.infer<typeof FormDataSchema>;

const steps = [
  { id: "Step 1", name: "Personal Information" },
  { id: "Step 2", name: "Document Information" },
  { id: "Step 3", name: "Complete" },
];
export default function MultiStepForm() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [dobType, setDobType] = useState<"BS" | "AD">("AD");
  const [issueDateType, setIssueDateType] = useState<"BS" | "AD">("AD");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);
  const [backFileType, setBackFileType] = useState<"image" | "pdf" | null>(
    null
  );
  const [backFileName, setBackFileName] = useState<string | null>(null);

  const stepFields: (keyof Inputs)[][] = [
    ["fullNameEn", "fullNameNp", "gender", "dateOfBirthAD", "phoneNumber"],

    [
      "citizenshipNumber",
      "issuedDistrict",
      "issueDateAD",
      "citizenshipFront",
      "citizenshipBack",
    ],
  ];

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      fullNameEn: "",
      fullNameNp: "",
      gender: undefined,
      dateOfBirthAD: "",
      dateOfBirthBS: "",
      age: undefined,
      phoneNumber: "",

      citizenshipNumber: "",
      issuedDistrict: "",
      issueDateAD: "",
      issueDateBS: "",
      citizenshipFront: undefined,
      citizenshipBack: undefined,
    },
  });

  const {
    
    handleSubmit,
    trigger,
   
   
   
  } = form;

  const processForm = async (data: Inputs) => {
    try {
      const citizenshipFrontBase64 = await fileToBase64(data.citizenshipFront);

      const citizenshipBackBase64 = await fileToBase64(data.citizenshipBack);

      const userData = {
        ...data,
        citizenshipFront: citizenshipFrontBase64,
        citizenshipBack: citizenshipBackBase64,
      };

      console.log("DATA", userData);

      setCurrentStep(2);
    } catch (err) {
      console.error(err);
      toast.error("Failed to process files");
    }
  };

  const goPrevStep = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const goNextStep = async () => {
    if (currentStep === 0) {
    

      const dobField = dobType === "AD" ? "dateOfBirthAD" : "dateOfBirthBS";

      const isValid = await trigger([
        "fullNameEn",
        "fullNameNp",
        "gender",
        dobField,
        "phoneNumber",
      ]);

      if (!isValid) return;
    }

    if (currentStep === 1) {
      const isValid = await trigger(stepFields[1], {
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
const isStep2Valid =
  currentStep === 1 &&
  stepFields[1].every(
    (field) => !form.formState.errors[field]
  );

  
  return (
    <section className="absolute inset-0 flex flex-col justify-between p-24">
      <Stepper steps={steps} currentStep={currentStep} />

      <Form {...form}>
        <form onSubmit={handleSubmit(processForm)}>
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key={`step-${currentStep}`}
                initial={{
                  x: previousStep < currentStep ? "50%" : "-50%",
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                exit={{
                  x: previousStep < currentStep ? "-50%" : "50%",
                  opacity: 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <PersonalStep
                  form={form}
                  dobType={dobType}
                  setDobType={setDobType}
                />
              </motion.div>
            )}

            {currentStep === 1 && (
      
             <motion.div
  key={`step-${currentStep}`}
  initial={{ x: "-50%", opacity: 0 }}   
  animate={{ x: 0, opacity: 1 }}        
 
  transition={{  ease: "easeOut" }}
>

                <DocumentStep
                  form={form}
                  issueDateType={issueDateType}
                  setIssueDateType={setIssueDateType}
                  previewState={{
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
                  }}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CompleteStep />
              </motion.div>
            )}
          </AnimatePresence>

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

              {currentStep === 1 && isStep2Valid&& (
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
