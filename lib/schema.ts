
import { z } from 'zod'

export const FormDataSchema = z.object({
fullNameEn: z.string().trim().min(1 , 'Name is required').regex(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
fullNameNp: z.string().trim().optional().refine((val)=>!val || /^[\u0900-\u097F\s]+$/.test(val),  {
      message: "Only Nepali letters are allowed",
    }
  ), 
gender: z.enum(['male' ,'female'] as const,{
    required_error: "Gender is required",
}),
dateOfBirthBS: z.string(),
dateOfBirthAD: z.string(),
phoneNumber: z.string().optional(),
  })
 

  // citizenshipNumber: z.string().min(1),
  // issuedDistrict: z.string().min(1),
  // issuedDate: z.string().min(1),
  // citizenshipFront: z.any(),
  // citizenshipBack: z.any(),
.refine((data) => data.dateOfBirthBS || data.dateOfBirthAD,{
    message: "Date of birth is required ",
    path: ["dateOfBirthBS"],
})
.superRefine((data, ctx) => {
    const phoneRegex = /^9\d{9}$/;

    // male & 18+ → REQUIRED
    if (data.gender === "male" && data.age >= 18) {
      if (!data.phoneNumber || data.phoneNumber.trim() === "") {
        ctx.addIssue({
          path: ["phoneNumber"],
          message: "Phone number is required",
          code: z.ZodIssueCode.custom,
        });
        return;
      }
    }
    // If phone exists → must be valid
    if (
      data.phoneNumber &&
      data.phoneNumber.trim() !== "" &&
      !phoneRegex.test(data.phoneNumber)
    ) {
      ctx.addIssue({
        path: ["phoneNumber"],
        message: "Phone number must be 10 digits and start with 9",
        code: z.ZodIssueCode.custom,
      });
    }
  });