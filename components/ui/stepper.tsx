import { cn } from "@/lib/utils"

type Step = {
  id: string
  name: string
  fields: string[]
}

type StepperProps = {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="space-y-4 md:flex md:space-x-8 md:space-y-0"
      >
        {steps.map((step, index) => {
          const isCompleted = currentStep > index
          const isCurrent = currentStep === index

          return (
            <li key={step.id} className="md:flex-1">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex w-full flex-col py-2 pl-4 transition-colors md:pl-0 md:pt-4",
                  "border-l-4 md:border-l-0 md:border-t-4",
                  (isCompleted || isCurrent)
                    ? "border-primary"
                    : "border-muted"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    (isCompleted || isCurrent)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.id}
                </span>

                <span className="text-sm font-medium">
                  {step.name}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
