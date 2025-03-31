"use client"

import { useEffect, useState } from "react"
import { fetchSeminars, deleteSeminar, updateSeminar, type Seminar } from "@/lib/api"
import SeminarCard from "./SeminarCard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SeminarSkeleton } from "./seminar-skeleton"

export default function SeminarsList() {
  // State variables
  const [seminars, setSeminars] = useState<Seminar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""

  // Fetch seminars on component mount or when search query changes
  useEffect(() => {
    loadSeminars()
  }, [query])

  // Function to load seminars from the API
  const loadSeminars = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching seminars...")
      const data = await fetchSeminars()
      console.log("Seminars fetched successfully:", data)

      // Filter seminars if there's a search query
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

  // Handle seminar deletion
  const handleDelete = async (id: number) => {
    try {
      await deleteSeminar(id)
      // Update the local state after successful deletion
      setSeminars(seminars.filter((seminar) => seminar.id !== id))
    } catch (err) {
      setError("Не удалось удалить семинар. Пожалуйста, попробуйте позже.")
      console.error("Error deleting seminar:", err)
    }
  }

  // Handle seminar update
  const handleUpdate = async (updatedSeminar: Seminar) => {
    try {
      const updated = await updateSeminar(updatedSeminar)
      // Update the local state after successful update
      setSeminars(seminars.map((seminar) => (seminar.id === updated.id ? updated : seminar)))
    } catch (err) {
      setError("Не удалось обновить семинар. Пожалуйста, попробуйте позже.")
      console.error("Error updating seminar:", err)
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SeminarSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={loadSeminars} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Попробовать снова
          </Button>
        </div>
      </motion.div>
    )
  }

  // Render seminars list
  return (
    <div className="py-8">
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

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seminars.map((seminar, index) => (
            <SeminarCard
              key={seminar.id}
              seminar={seminar}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              index={index}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Display message if no seminars are available */}
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

