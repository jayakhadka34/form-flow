
//   if (!data.dateOfBirthAD && !data.dateOfBirthBS) {
//     ctx.addIssue({
//       path: ["dateOfBirthAD"],
//       message: "Date of birth is required",
//       code: z.ZodIssueCode.custom,
//     });
//   }
// if (
//   data.gender === "male" &&
//   typeof data.age === "number" &&
//   data.age > 18
// ) {
//   if (!data.phoneNumber) {
//     ctx.addIssue({
//       path: ["phoneNumber"],
//       message: "Phone number is required for males above 18 years",
//       code: z.ZodIssueCode.custom,
//     });
//   }
// }


// });

import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 2MB",
  })
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Only JPG, PNG or PDF allowed",
  });
export const Step1Schema = z
  .object({
    fullNameEn: z
      .string()
      .trim()
      .min(1, "Name is required")
      .regex(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

    fullNameNp: z
      .string()
      .optional()
      .refine((val) => !val || /^[\u0900-\u097F\s]+$/.test(val), {
        message: "नेपाली युनिकोड मात्र प्रयोग गर्नुहोस्",
      }),

    gender: z.enum(["male", "female", "other"], {
      required_error: "Gender is required",
    }),

    age: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().int().min(0).max(120)
    ),

    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^9\d{9}$/.test(val),
        "Phone number must be 10 digits and start with 9"
      ),
  })
  .superRefine((data, ctx) => {
    if (
      data.gender === "male" &&
      typeof data.age === "number" &&
      data.age > 18 &&
      !data.phoneNumber
    ) {
      ctx.addIssue({
        path: ["phoneNumber"],
        message: "Phone number is required for males above 18 years",
        code: z.ZodIssueCode.custom,
      });
    }
  });
export const Step2Schema = z
  .object({
    citizenshipNumber: z.string().min(1, "Citizenship Number is required"),
    issuedDistrict: z.string().min(1, "Issued District is required"),

    issueDateAD: z.string().optional(),
    issueDateBS: z.string().optional(),

    citizenshipFront: fileSchema,
    citizenshipBack: fileSchema,
  })
  .refine((data) => data.issueDateAD || data.issueDateBS, {
    message: "Issue date is required",
    path: ["issueDateAD"],
  });
export const FormDataSchema = Step1Schema.merge(Step2Schema);
