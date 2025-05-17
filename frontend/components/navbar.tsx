"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, BarChart3, Dumbbell, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const navItems = [
  { label: "Início", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Treinos", href: "/treinos", icon: Dumbbell },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, usuario } = useAuth()

  // Fechar menu ao clicar em um link
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="flex w-full justify-between items-center">
          <Link href="/" className="flex items-center font-bold text-xl">
            FitTracker
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Link
                href="/perfil"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/perfil"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <User className="h-4 w-4 mr-2" />
                {usuario?.nome || "Perfil"}
              </Link>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/login" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <span className="sr-only">Abrir menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden p-4 border-t">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
                onClick={closeMenu}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Link
                href="/perfil"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                  pathname === "/perfil"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
                onClick={closeMenu}
              >
                <User className="h-4 w-4 mr-2" />
                {usuario?.nome || "Perfil"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary p-2 rounded-md"
                onClick={closeMenu}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
