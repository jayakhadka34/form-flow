'use client'

import { useState } from "react"
import { Stepper } from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { FormDataSchema } from "@/lib/schema"
import { useForm } from "react-hook-form"
import z from "zod"
import { id } from "zod/locales"

// type Inputs= z.infer<typeof FormDataSchema>

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
 
  const [currentStep, setCurrentStep]= useState(0)
  const step= steps[currentStep]

//   const {  register, watch,handleSubmit, reset, trigger ,formState:{errors}} = useForm<Inputs>({
//     resolver: zodResolver(FormDataSchema)
//   })

//  type FieldName = keyof Inputs
   return(
        <div className="space-y-8">
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Step Title */}
      <h2 className="text-xl font-semibold">{step.name}</h2>

      {/* Fields (for now just labels) */}
      <div className="grid gap-4">
        {step.fields.map((field) => (
          <div
            key={field}
            className="rounded-md border p-3 text-sm"
          >
            {field}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((s) => s - 1)}
        >
          Back
        </Button>

        <Button
          onClick={() => setCurrentStep((s) => s + 1)}
          disabled={currentStep === steps.length - 1}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
   

