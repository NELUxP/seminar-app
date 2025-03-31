"use client"

import type React from "react"

import { useState } from "react"
import type { Seminar } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Calendar, Clock, Type, FileText, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EditSeminarModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (seminar: Seminar) => Promise<void>
  seminar: Seminar
}

export default function EditSeminarModal({ isOpen, onClose, onUpdate, seminar }: EditSeminarModalProps) {
  // Local state for form data
  const [formData, setFormData] = useState<Seminar>({ ...seminar })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await onUpdate(formData)
      onClose()
      setCurrentStep(1) // Reset to first step after successful submission
    } catch (err) {
      setError("Не удалось обновить семинар. Пожалуйста, попробуйте снова.")
      console.error("Error submitting form:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Название
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Описание
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="min-h-[120px] focus-visible:ring-primary"
              />
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Дата
                </Label>
                <Input
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Время
                </Label>
                <Input
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="photo" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                URL фото
              </Label>
              <Input
                id="photo"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                required
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="mt-4 rounded-md overflow-hidden border aspect-video relative">
              {formData.photo && (
                <img
                  src={formData.photo || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                  }}
                />
              )}
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          // Reset to first step when closing
          setTimeout(() => setCurrentStep(1), 300)
        }
      }}
    >
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редактировать семинар</DialogTitle>
            <DialogDescription>Измените информацию о семинаре и нажмите Сохранить.</DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {/* Progress indicator */}
            <div className="flex justify-between mb-6">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full flex-1 mx-1 transition-all duration-300 ${
                    index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm mt-4">
                {error}
              </motion.div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="rounded-full"
                >
                  Назад
                </Button>
              )}
            </div>
            <div>
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} disabled={isSubmitting} className="rounded-full">
                  Далее
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="rounded-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Сохранить
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

