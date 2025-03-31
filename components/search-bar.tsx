"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"

export function SearchBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <motion.div
      className="relative flex items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Поиск семинаров..."
          className="pl-10 pr-20 h-12 rounded-full border-primary/20 focus-visible:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchQuery)
            }
          }}
        />
      </div>
      <Button
        className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-10 px-4"
        onClick={() => handleSearch(searchQuery)}
      >
        Найти
      </Button>
    </motion.div>
  )
}

