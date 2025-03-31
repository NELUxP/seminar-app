"use client" // Указывает, что это клиентский компонент Next.js

import { useEffect, useState } from "react"
// Импорт API функций и типов
import { fetchSeminars, deleteSeminar, updateSeminar, type Seminar } from "@/lib/api"
// Компоненты
import SeminarCard from "./SeminarCard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation" // Хук для работы с параметрами URL
import { motion, AnimatePresence } from "framer-motion" // Анимации
import { SeminarSkeleton } from "./seminar-skeleton" // Скелетон загрузки

export default function SeminarsList() {
  // Состояния компонента
  const [seminars, setSeminars] = useState<Seminar[]>([]) // Список семинаров
  const [loading, setLoading] = useState(true) // Флаг загрузки
  const [error, setError] = useState<string | null>(null) // Ошибки
  const searchParams = useSearchParams() // Параметры поиска из URL
  const query = searchParams.get("query") || "" // Поисковый запрос

  // Эффект для загрузки данных при изменении поискового запроса
  useEffect(() => {
    loadSeminars()
  }, [query])

  // Функция загрузки семинаров
  const loadSeminars = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching seminars...")
      const data = await fetchSeminars()
      console.log("Seminars fetched successfully:", data)

      // Фильтрация данных по поисковому запросу
      const filteredData = query
        ? data.filter(
            (seminar: Seminar) =>
              seminar.title.toLowerCase().includes(query.toLowerCase()) ||
              seminar.description.toLowerCase().includes(query.toLowerCase()),
          )
        : data

      setSeminars(filteredData)
    } catch (err) {
      console.error("Error loading seminars:", err)
      setError("Не удалось загрузить данные семинаров. Пожалуйста, попробуйте позже.")
    } finally {
      setLoading(false)
    }
  }

  // Обработчик удаления семинара
  const handleDelete = async (id: number) => {
    try {
      await deleteSeminar(id)
      // Обновление локального состояния после удаления
      setSeminars(seminars.filter((seminar) => seminar.id !== id))
    } catch (err) {
      setError("Не удалось удалить семинар. Пожалуйста, попробуйте позже.")
      console.error("Error deleting seminar:", err)
    }
  }

  // Обработчик обновления семинара
  const handleUpdate = async (updatedSeminar: Seminar) => {
    try {
      const updated = await updateSeminar(updatedSeminar)
      // Обновление локального состояния
      setSeminars(seminars.map((seminar) => (seminar.id === updated.id ? updated : seminar)))
    } catch (err) {
      setError("Не удалось обновить семинар. Пожалуйста, попробуйте позже.")
      console.error("Error updating seminar:", err)
    }
  }

  // Рендер состояния загрузки
  if (loading) {
    return (
      <div className="py-8">
        {/* Скелетоны для анимированной загрузки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SeminarSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  // Рендер состояния ошибки
  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-8">
        {/* Компонент Alert для отображения ошибки */}
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          {/* Кнопка повторной попытки */}
          <Button onClick={loadSeminars} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Попробовать снова
          </Button>
        </div>
      </motion.div>
    )
  }

  // Основной рендер компонента
  return (
    <div className="py-8">
      {/* Блок с результатами поиска */}
      {query && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h2 className="text-xl font-medium mb-2">
            {seminars.length > 0
              ? `Найдено ${seminars.length} семинаров по запросу "${query}"`
              : `По запросу "${query}" ничего не найдено`}
          </h2>
          {seminars.length === 0 && (
            <p className="text-muted-foreground">Попробуйте изменить поисковый запрос или просмотреть все семинары</p>
          )}
        </motion.div>
      )}

      {/* Список семинаров с анимациями */}
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seminars.map((seminar, index) => (
            <SeminarCard
              key={seminar.id}
              seminar={seminar}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              index={index} // Индекс для анимации
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Состояние пустого списка (без поиска) */}
      {seminars.length === 0 && !query && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <p className="text-muted-foreground text-lg">Семинары не найдены</p>
          <Button onClick={loadSeminars} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Обновить
          </Button>
        </motion.div>
      )}
    </div>
  )
}