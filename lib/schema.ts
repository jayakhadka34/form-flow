
// import { z } from 'zod'

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];


import { z } from "zod";

export const FormDataSchema = z
  .object({
    fullNameEn: z
      .string()
      .trim()
      .min(1, "Name is required")
      .regex(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

    fullNameNp: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^[\u0900-\u097F\s]+$/.test(val),
        { message: "Only Nepali letters are allowed" }
      ),

    gender: z.enum(["male", "female"], {
      required_error: "Gender is required",
    }),

    // ✅ FIXED: age is a NUMBER
    age: z.number().optional(),

    dateOfBirthAD: z.string().min(1, "DOB (AD) required"),
    dateOfBirthBS: z.string().min(1, "DOB (BS) required"),

    phoneNumber: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^9\d{9}$/.test(val),
        "Phone number must be 10 digits and start with 9"
      ),

    // citizenshipNumber: z.string().min(1, "Citizenship Number is required"),

    //   citizenshipFront: z
    // .instanceof(File)
    // .refine((file) => file.size <= MAX_FILE_SIZE, {
    //   message: "File size must be less than 2MB",
    // })
    // .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    //   message: "Only JPG, PNG, or PDF files are allowed",
    // }),
    // citizenshipBack: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.gender === "male" && data.age !== undefined && data.age > 18) {
      if (!data.phoneNumber || data.phoneNumber.trim() === "") {
        ctx.addIssue({
          path: ["phoneNumber"],
          message: "Phone number is required for males above 18",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
