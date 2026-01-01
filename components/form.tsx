'use client'

import { FormDataSchema } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { id } from "zod/locales"



const steps =[
  {
    id: 'Step 1',
    name: 'Personal Information',
    fields: ['Full Name(English)', 'Full Name(Nepali)','Gender', 'Date of Birth(BS/AD)', 'Phone Number']
  },
  {
    id: 'Step 2',
    name:'Document Information',
    fields: ['Citizenship Number', 'Issued District', 'Issued Date(BS/AD)', 'Upload Citizenship Front', 'Upload Citizenship Back']
  }
]

export default function Form(){


  const { handleSubmit, reset, formState:{errors}} = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })


   return(
    
   )
}
