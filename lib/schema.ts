// import { z} from 'zod'

// export const FormDataSchema= z.object({
// Name: z.string().min(1 , 'Name is required'),
// NepaliName: z.string().min(1 , 'Nepali name is required'),
// Gender : z.string().min(1, 'Gender is required'),
// DateOfBirth:z.string().min(1, 'Date of birth is required'),
// PhoneNumber:z.string().min(1, "Phone number is required").regex(/^[0-9]{10}$/,'Phone number must be 10 digits'),

//   citizenshipNumber: z.string().min(1),
//   issuedDistrict: z.string().min(1),
//   issuedDate: z.string().min(1),
//   citizenshipFront: z.any(),
//   citizenshipBack: z.any(),
// })
// export type FormInputs = z.infer<typeof FormDataSchema>
import { data } from 'framer-motion/client'
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
dateOfBirthBS: z.string().optional(),
dateOfBirthAD: z.string().optional(),
phoneNumber:z.string().min(1, "Phone number is required").regex(/^[0-9]{10}$/,'Phone number must be 10 digits'),

  citizenshipNumber: z.string().min(1),
  issuedDistrict: z.string().min(1),
  issuedDate: z.string().min(1),
  citizenshipFront: z.any(),
  citizenshipBack: z.any(),
})
.refine((data) => data.dateOfBirthBS || data.dateOfBirthAD,{
    message: "Date of birth is required ",
    path: ["dateOfBirthBS"],
})