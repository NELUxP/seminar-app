import SeminarsList from "@/components/SeminarsList"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "@/components/search-bar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-background/80 pb-20">
      {/* Hero section with animated background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4 animate-fade-in">
            Управление семинарами
          </h1>

          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up">
            Просматривайте, редактируйте и управляйте семинарами Kosmoteros с помощью нашего интерактивного интерфейса
          </p>

          <div className="max-w-xl mx-auto mb-12 animate-fade-in-delay">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <SeminarsList />
      </div>
    </main>
  )
}

