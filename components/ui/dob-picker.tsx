

// // 'use client'

// // import NepaliCalendar from "@sbmdkl/nepali-datepicker-reactjs"
// // import NepaliDate from "nepali-date-converter"
// // import { Calendar as CalendarIcon } from "lucide-react"

// // import { Calendar as GregorianCalendar } from "@/components/ui/calendar"
// // import { Button } from "@/components/ui/button"
// // import {
// //   Popover,
// //   PopoverContent,
// //   PopoverTrigger,
// // } from "@/components/ui/popover"
// // import {
// //   FormControl,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// //   FormField,
// // } from "@/components/ui/form"
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select"

// // type DOBPickerProps = {
// //   control: any
// //   setValue: any
// //   getValues: any
// //   dobType: "BS" | "AD"
// //   setDobType: (v: "BS" | "AD") => void
// // }

// // // ---------- Helpers ----------
// // const parseAD = (value?: string) => {
// //   if (!value) return undefined
// //   const [y, m, d] = value.split("-").map(Number)
// //   const date = new Date(y, m - 1, d)
// //   return isNaN(date.getTime()) ? undefined : date
// // }

// // const formatAD = (date: Date) =>
// //   `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
// //     2,
// //     "0"
// //   )}-${String(date.getDate()).padStart(2, "0")}`

// // // ---------- Component ----------
// // export function DOBPicker({
// //   control,
// //   setValue,
// //   getValues,
// //   dobType,
// //   setDobType,
// // }: DOBPickerProps) {
// //   return (
// //     <FormField
// //       control={control}
// //       name="dateOfBirthAD"
// //       render={({ field }) => {
// //         const adValue = field.value
// //         const bsValue = getValues("dateOfBirthBS")
// //         const selectedADDate = parseAD(adValue)

// //         // 🔥 UI display depends ONLY on dobType
// //       const displayLabel =
// //   dobType === "AD"
// //     ? adValue || "Select date"
// //     : bsValue || "Select date"


// //         return (
// //           <FormItem className="flex flex-col">
// //             <FormLabel>Date of Birth</FormLabel>

// //             <div className="flex gap-2 items-center">
// //               <Popover>
// //                 <PopoverTrigger asChild>
// //                   <FormControl>
// //                     <Button
// //                       variant="outline"
// //                       className="w-full justify-between font-normal"
// //                     >
// //                       {displayLabel}
// //                       <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
// //                     </Button>
// //                   </FormControl>
// //                 </PopoverTrigger>

// //                 <PopoverContent
// //                   align="start"
// //                   className="p-2 w-auto bg-background border rounded-md shadow-md"
// //                 >
// //                   {dobType === "AD" ? (
// //                     // -------- AD Calendar --------
// //                     <GregorianCalendar
// //                       mode="single"
// //                       captionLayout="dropdown"
// //                       fromYear={1950}
// //                       toYear={new Date().getFullYear()}
// //                       disabled={(date) => date > new Date()}
// //                       selected={selectedADDate}
// //                       onSelect={(date) => {
// //                         if (!date) {
// //                           field.onChange("")
// //                           setValue("dateOfBirthBS", "")
// //                           return
// //                         }

// //                         const adStr = formatAD(date)
// //                         field.onChange(adStr)

// //                         // AD → BS
// //                         const nep = new NepaliDate(adStr)
// //                         const bsStr = `${nep.year}-${String(nep.month).padStart(
// //                           2,
// //                           "0"
// //                         )}-${String(nep.day).padStart(2, "0")}`

// //                         setValue("dateOfBirthBS", bsStr, {
// //                           shouldDirty: true,
// //                           shouldValidate: true,
// //                         })
// //                       }}
// //                     />
// //                   ) : (
// //                     // -------- BS Calendar --------
// //                     <div className="w-[400px]">
// //                         <NepaliCalendar
// //                         language="en"
// //                         options={{ dateFormat: "YYYY-MM-DD" }}
// //                         onChange={({ bsDate }) => {
// //                           try {
// //                             // BS → AD
// //                             const nep = new NepaliDate(bsDate)
// //                             const adStr = `${nep.adYear}-${String(
// //                               nep.adMonth
// //                             ).padStart(2, "0")}-${String(
// //                               nep.adDay
// //                             ).padStart(2, "0")}`

// //                             field.onChange(adStr)
// //                             setValue("dateOfBirthBS", bsDate, {
// //                               shouldDirty: true,
// //                               shouldValidate: true,
// //                             })
// //                           } catch (err) {
// //                             console.error("BS → AD conversion failed", err)
// //                             field.onChange("")
// //                             setValue("dateOfBirthBS", "")
// //                           }
// //                         }}
// //                       />  

// //                     </div>
// //                   )}
// //                 </PopoverContent>
// //               </Popover>

// //               {/* -------- AD / BS Switch -------- */}
// //               <Select
// //                 value={dobType}
// //                 onValueChange={(v) => setDobType(v as "BS" | "AD")}
// //               >
// //                 <SelectTrigger className="w-[80px]">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="AD">AD</SelectItem>
// //                   <SelectItem value="BS">BS</SelectItem>
// //                 </SelectContent>
// //               </Select>

// //             </div>

// //             <FormMessage />
// //           </FormItem>
// //         )
// //       }}
// //     />
// //   )
// // }


// 'use client'

// import NepaliCalendar from "@sbmdkl/nepali-datepicker-reactjs"
// import NepaliDate from "nepali-date-converter"
// import { Calendar as CalendarIcon } from "lucide-react"

// import { Calendar as GregorianCalendar } from "@/components/ui/calendar"
// import { Button } from "@/components/ui/button"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import {
//   FormControl,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormField,
// } from "@/components/ui/form"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// type DOBPickerProps = {
//   control: any
//   setValue: any
//   getValues: any
//   dobType: "BS" | "AD"
//   setDobType: (v: "BS" | "AD") => void
// }

// /* ---------------- Helpers ---------------- */

// const parseAD = (value?: string) => {
//   if (!value) return undefined
//   const [y, m, d] = value.split("-").map(Number)
//   const date = new Date(y, m - 1, d)
//   return isNaN(date.getTime()) ? undefined : date
// }

// const formatAD = (date: Date) =>
//   `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//     2,
//     "0"
//   )}-${String(date.getDate()).padStart(2, "0")}`

// const adToBs = (ad: string) => {
//   const nep = new NepaliDate(ad)
//   return `${nep.year}-${String(nep.month).padStart(2, "0")}-${String(
//     nep.day
//   ).padStart(2, "0")}`
// }

// const bsToAd = (bs: string) => {
//   const nep = new NepaliDate(bs)
//   return `${nep.adYear}-${String(nep.adMonth).padStart(
//     2,
//     "0"
//   )}-${String(nep.adDay).padStart(2, "0")}`
// }

// /* ---------------- Component ---------------- */

// export function DOBPicker({
//   control,
//   setValue,
//   getValues,
//   dobType,
//   setDobType,
// }: DOBPickerProps) {
//   return (
//     <FormField
//       control={control}
//       name="dateOfBirthAD" // 🔥 AD IS SOURCE OF TRUTH
//       render={({ field }) => {
//         const adValue = field.value
//         const bsValue = getValues("dateOfBirthBS")
//         const selectedADDate = parseAD(adValue)

//         const displayLabel =
//           dobType === "AD"
//             ? adValue || "Select date"
//             : bsValue || "Select date"

//         return (
//           <FormItem className="flex flex-col">
//             <FormLabel>Date of Birth</FormLabel>

//             <div className="flex gap-2 items-center">
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <FormControl>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-between font-normal"
//                     >
//                       {displayLabel}
//                       <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
//                     </Button>
//                   </FormControl>
//                 </PopoverTrigger>

//                 <PopoverContent
//                   align="start"
//                   className="p-2 w-auto bg-background border rounded-md shadow-md"
//                 >
//                   {dobType === "AD" ? (
//                     /* ---------- AD Calendar ---------- */
//                     <GregorianCalendar
//                       mode="single"
//                       captionLayout="dropdown"
//                       fromYear={1950}
//                       toYear={new Date().getFullYear()}
//                       disabled={(date) => date > new Date()}
//                       selected={selectedADDate}
//                       onSelect={(date) => {
//                         if (!date) return

//                         const adStr = formatAD(date)
//                         field.onChange(adStr)

//                         // AD → BS (for UI only)
//                         setValue("dateOfBirthBS", adToBs(adStr), {
//                           shouldDirty: false,
//                         })
//                       }}
//                     />
//                   ) : (
//                     /* ---------- BS Calendar ---------- */
//                     <div className="w-[400px]">
//                       <NepaliCalendar
//                         language="en"
//                         options={{ dateFormat: "YYYY-MM-DD" }}
//                         onChange={({ bsDate }) => {
//                           if (!bsDate) return

//                           try {
//                             const adStr = bsToAd(bsDate)

//                             // 🔥 STORE ONLY AD
//                             field.onChange(adStr)

//                             // BS only for display
//                             setValue("dateOfBirthBS", bsDate, {
//                               shouldDirty: false,
//                             })
//                           } catch (err) {
//                             console.error("BS → AD conversion failed", err)
//                           }
//                         }}
//                       />
//                     </div>
//                   )}
//                 </PopoverContent>
//               </Popover>

//               {/* ---------- AD / BS SWITCH ---------- */}
//               <Select
//                 value={dobType}
//                 onValueChange={(v) => {
//                   const type = v as "BS" | "AD"
//                   setDobType(type)

//                   const ad = getValues("dateOfBirthAD")
//                   if (!ad) return

//                   // AD → BS when switching to BS
//                   if (type === "BS") {
//                     setValue("dateOfBirthBS", adToBs(ad), {
//                       shouldDirty: false,
//                     })
//                   }
//                   // BS → AD needs NO action
//                 }}
//               >
//                 <SelectTrigger className="w-[80px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="AD">AD</SelectItem>
//                   <SelectItem value="BS">BS</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <FormMessage />
//           </FormItem>
//         )
//       }}
//     />
//   )
// }
