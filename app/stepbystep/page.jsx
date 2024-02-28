'use client'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

const StepByStep = () => {
  const data = {
    "user": {
      username: "Yusuf"
    },
    "order": {
      orderId: "00000"
    }
  }
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([
    {
      id: 0,
      step: 0,
      requirements: (dt) => {
        return !!dt.user.username
      },
      state: "continue",
      title: "Step 1",
      Component: () => <div className="flex-1 bg-green-500" />
    },
    {
      id: 0,
      step: 0,
      requirements: (dt) => {
        return !!dt.order.orderId
      },
      state: "complate",
      title: "Step 2",
      Component: () => <div className="flex-1 bg-red-500" />
    },
    {
      id: 0,
      step: 0,
      requirements: (dt) => {
        return !!dt.order?.complate
      },
      state: "none",
      title: "Step 3",
      Component: () => <div className="flex-1 bg-orange-500" />
    }
  ])

  const getColor = (state) => {
    if (state === "continue") {
      return "bg-orange-500"
    } else if (state === "none") {
      return "bg-slate-500"
    } else if (state === "complate") {
      return "bg-green-500"
    }
  }

  return (
    <div className='h-screen w-full flex'>
      <div className="flex-[0.2] bg-slate-600 flex flex-col p-4 gap-2">
        {steps.map((step, index) => (
          <div
          onClick={() => setCurrentStep(index)}
          className={twMerge(getColor(step.state), "p-3 font-semibold rounded hover:opacity-75 transition-all duration-200 cursor-pointer", step.requirements(data) && "opacity-25 pointer-events-none")}>
            {step.title}
          </div>
        ))}
      </div>

      {steps[currentStep].Component()}
    </div>
  )
}

export default StepByStep