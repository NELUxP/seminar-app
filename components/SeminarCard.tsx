"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Calendar, Clock } from "lucide-react"
import type { Seminar } from "@/lib/api"
import DeleteConfirmation from "./DeleteConfirmation"
import EditSeminarModal from "./EditSeminarModal"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface SeminarCardProps {
  seminar: Seminar
  onDelete: (id: number) => Promise<void>
  onUpdate: (seminar: Seminar) => Promise<void>
  index: number
}

export default function SeminarCard({ seminar, onDelete, onUpdate, index }: SeminarCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(seminar.id)
      setShowDeleteModal(false)
    } catch (error) {
      console.error("Error in delete confirmation:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card
        className="h-full flex flex-col overflow-hidden border-primary/10 dark:border-primary/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Seminar image with overlay */}
        <div className="relative h-56 w-full overflow-hidden">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <Image
              src={seminar.photo || "/placeholder.svg"}
              alt={seminar.title}
              fill
              className="object-cover transition-all"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-background/80 backdrop-blur-sm">
              <Calendar className="h-3 w-3" />
              {seminar.date}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 bg-background/80 backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {seminar.time}
            </Badge>
          </div>
        </div>

        {/* Seminar content */}
        <CardContent className="flex-grow p-6">
          <h3 className="text-xl font-bold mb-3 line-clamp-2">{seminar.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{seminar.description}</p>
        </CardContent>

        {/* Action buttons */}
        <CardFooter className="p-6 pt-0 flex justify-end gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Изменить
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)} className="rounded-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </motion.div>
        </CardFooter>

        {/* Delete confirmation modal */}
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          seminarTitle={seminar.title}
        />

        {/* Edit seminar modal */}
        <EditSeminarModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
          seminar={seminar}
        />
      </Card>
    </motion.div>
  )
}

