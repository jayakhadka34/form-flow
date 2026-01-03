
'use client'

import React from "react"
import NepaliCalendar from "@sbmdkl/nepali-datepicker-reactjs"
import { Calendar as GregorianCalendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarIcon } from "lucide-react"
import NepaliDate from "nepali-date-converter"

type DOBPickerProps = {
  control: any
  setValue: any
  getValues: any
  dobType: "BS" | "AD"
  setDobType: (v: "BS" | "AD") => void
}

// helper to parse AD date string "YYYY-MM-DD" to JS Date
const parseDate = (value?: string) => {
  if (!value) return null
  const parts = value.split("-").map(Number)
  const date = new Date(parts[0], parts[1] - 1, parts[2])
  return isNaN(date.getTime()) ? null : date
}

export function DOBPicker({
  control,
  setValue,
  getValues,
  dobType,
  setDobType,
}: DOBPickerProps) {
  return (
    <FormField
      control={control}
      name="dateOfBirthAD"
      render={({ field }) => {
        const selectedADDate = parseDate(field.value)

        // display label depends on AD or BS mode
        const displayLabel =
          dobType === "AD"
            ? field.value || "Select date"
            : (() => {
                if (!field.value) return "Select date"
                try {
                  const nep = new NepaliDate(field.value)
                  return nep.format("YYYY-MM-DD")
                } catch {
                  return "Select date"
                }
              })()

        return (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>

            <div className="flex gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal"
                    >
                      {displayLabel}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-auto" align="start">
                  {dobType === "AD" ? (
                    <GregorianCalendar
                      mode="single"
                      captionLayout="dropdown"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                      disabled={(date) => date > new Date()}
                      selected={selectedADDate ?? undefined}
                      onSelect={(date) => {
                        if (!date) {
                          field.onChange("")
                          setValue("dateOfBirthBS", "")
                          return
                        }
                        const adStr = `${date.getFullYear()}-${(
                          date.getMonth() + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${date
                          .getDate()
                          .toString()
                          .padStart(2, "0")}`

                        field.onChange(adStr)

                        try {
                          const nep = new NepaliDate(adStr)
                          const bsStr = `${nep.year}-${String(
                            nep.month
                          ).padStart(2, "0")}-${String(nep.day).padStart(
                            2,
                            "0"
                          )}`
                          setValue("dateOfBirthBS", bsStr, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        } catch (e) {
                          console.error("AD → BS conversion failed", e)
                        }
                      }}
                    />
                  ) : (
                    <NepaliCalendar
                      onChange={({ bsDate, adDate }) => {
                        // bsDate, adDate in YYYY-MM-DD format
                        field.onChange(adDate) // always store AD in form
                        setValue("dateOfBirthBS", bsDate, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }}
                      language="en"
                      options={{
                        // optional: disable future dates
                        dateFormat: "YYYY-MM-DD",
                        defaultDate: selectedADDate
                          ? new NepaliDate(field.value).getBS()
                          : undefined,
                      }}
                    />
                  )}
                </PopoverContent>
              </Popover>

              <Select
                value={dobType}
                onValueChange={(v) => setDobType(v as "BS" | "AD")}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AD">AD</SelectItem>
                  <SelectItem value="BS">BS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
