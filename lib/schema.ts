import { z} from 'zod'

export const FormDataSchema= z.object({
Name: z.string().min(1 , 'Name is required'),
NepaliName: z.string().min(1 , 'Nepali name is required'),
Gender : z.string().min(1, 'Gender is required'),
DateOfBirth:z.string().min(1, 'Date of birth is required'),
PhoneNumber:z.string().min(1, "Phone number is required").regex(/^[0-9]{10}$/,'Phone number must be 10 digits'),
})