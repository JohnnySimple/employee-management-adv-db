"use client"

import * as React from "react"
import { Controller, FormProvider, useFormContext } from "react-hook-form"

export const Form = FormProvider

export function FormField({ ...props }: any) {
  return <Controller {...props} />
}

export function FormItem({ className, ...props }: any) {
  return <div className={className} {...props} />
}

export function FormLabel(props: any) {
  return <label {...props} />
}

export function FormControl(props: any) {
  return <div {...props} />
}

export function FormMessage({ children }: any) {
  if (!children) return null
  return <p className="text-sm text-red-500">{children}</p>
}