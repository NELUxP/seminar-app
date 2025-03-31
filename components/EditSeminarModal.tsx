"use client" // Указывает, что это клиентский компонент Next.js

import type React from "react" // Импорт типов React
import { useState } from "react" // Базовый хук состояния
import type { Seminar } from "@/lib/api" // Тип данных семинара
// Импорт UI компонентов
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
// Импорт иконок
import { Loader2, Calendar, Clock, Type, FileText, ImageIcon } from "lucide-react"
// Анимации
import { motion, AnimatePresence } from "framer-motion"

// Пропсы компонента
interface EditSeminarModalProps {
  isOpen: boolean // Флаг видимости модального окна
  onClose: () => void // Функция закрытия
  onUpdate: (seminar: Seminar) => Promise<void> // Функция обновления семинара
  seminar: Seminar // Данные редактируемого семинара
}

export default function EditSeminarModal({ 
  isOpen, 
  onClose, 
  onUpdate, 
  seminar 
}: EditSeminarModalProps) {
  // Состояние формы с данными семинара
  const [formData, setFormData] = useState<Seminar>({ ...seminar })
  // Состояние отправки формы
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Состояние для ошибок
  const [error, setError] = useState<string | null>(null)
  // Текущий шаг многошаговой формы
  const [currentStep, setCurrentStep] = useState(1)
  // Общее количество шагов
  const totalSteps = 3

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await onUpdate(formData) // Вызов функции обновления
      onClose() // Закрытие модалки после успеха
      setCurrentStep(1) // Сброс к первому шагу
    } catch (err) {
      setError("Не удалось обновить семинар. Пожалуйста, попробуйте снова.")
      console.error("Error submitting form:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Переход к следующему шагу
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Возврат к предыдущему шагу
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Рендер содержимого текущего шага
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Шаг 1: Основная информация
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }} // Анимация появления
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} // Анимация исчезновения
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Поле названия */}
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

            {/* Поле описания */}
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
      case 2: // Шаг 2: Дата и время
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
              {/* Поле даты */}
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
              {/* Поле времени */}
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
      case 3: // Шаг 3: Изображение
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Поле URL изображения */}
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

            {/* Превью изображения */}
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
          // Сброс к первому шагу после анимации закрытия
          setTimeout(() => setCurrentStep(1), 300)
        }
      }}
    >
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редактировать семинар</DialogTitle>
            <DialogDescription>
              Измените информацию о семинаре и нажмите Сохранить.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {/* Индикатор прогресса */}
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

            {/* Анимированное содержимое шагов */}
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

            {/* Отображение ошибок */}
            {error && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-destructive text-sm mt-4"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Футер с кнопками навигации */}
          <DialogFooter className="flex justify-between">
            <div>
              {/* Кнопка "Назад" (только не на первом шаге) */}
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
              {/* Кнопка "Далее" или "Сохранить" в зависимости от шага */}
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