"use client" // Указывает, что это клиентский компонент Next.js

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog" // Импорт компонентов диалога из UI библиотеки
import { Loader2 } from "lucide-react" // Иконка загрузки
import { motion, AnimatePresence } from "framer-motion" // Анимации для плавного появления/исчезновения

// Определение пропсов компонента
interface DeleteConfirmationProps {
  isOpen: boolean // Флаг видимости диалога
  onClose: () => void // Функция закрытия диалога
  onConfirm: () => Promise<void> // Асинхронная функция подтверждения удаления
  seminarTitle: string // Название семинара для отображения в сообщении
}

export default function DeleteConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  seminarTitle 
}: DeleteConfirmationProps) {
  // Состояние для отслеживания процесса удаления
  const [isDeleting, setIsDeleting] = useState(false)

  // Обработчик подтверждения удаления
  const handleConfirm = async () => {
    setIsDeleting(true) // Активируем состояние загрузки
    try {
      await onConfirm() // Вызываем переданную функцию подтверждения
    } finally {
      setIsDeleting(false) // В любом случае выключаем состояние загрузки
    }
  }

  return (
    // AnimatePresence для анимации при монтировании/размонтировании
    <AnimatePresence>
      {isOpen && (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
          <AlertDialogContent className="sm:max-w-[425px]">
            {/* Анимация для плавного появления/исчезновения содержимого */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} // Начальное состояние (невидимо, смещено вниз)
              animate={{ opacity: 1, y: 0 }} // Анимация появления
              exit={{ opacity: 0, y: 20 }} // Анимация исчезновения
              transition={{ duration: 0.2 }} // Длительность анимации
            >
              <AlertDialogHeader>
                {/* Заголовок с красным цветом для предупреждения */}
                <AlertDialogTitle className="text-destructive">
                  Вы уверены?
                </AlertDialogTitle>
                {/* Описание с динамическим названием семинара */}
                <AlertDialogDescription>
                  Вы собираетесь удалить семинар "{seminarTitle}". Это действие не может быть отменено.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                {/* Кнопка отмены */}
                <AlertDialogCancel disabled={isDeleting} className="rounded-full">
                  Отмена
                </AlertDialogCancel>
                {/* Кнопка подтверждения с обработчиком и состоянием загрузки */}
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault() // Предотвращаем стандартное поведение
                    handleConfirm() // Вызываем наш обработчик
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                  disabled={isDeleting} // Блокируем во время удаления
                >
                  {/* Условный рендеринг иконки загрузки */}
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isDeleting ? "Удаление..." : "Удалить"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AnimatePresence>
  )
}