"use client"

import Link from "next/link"
import { useState } from "react"
import { CalendarIcon, BarChart3Icon, DumbbellIcon, UserIcon, MenuIcon, XIcon } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-600" : "text-gray-600"
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <DumbbellIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">FitTracker</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/calendario" className={`flex items-center ${isActive("/calendario")}`}>
              <CalendarIcon className="h-5 w-5 mr-1" />
              <span>Calendário</span>
            </Link>
            <Link href="/dashboard" className={`flex items-center ${isActive("/dashboard")}`}>
              <BarChart3Icon className="h-5 w-5 mr-1" />
              <span>Dashboard</span>
            </Link>
            <Link href="/treinos" className={`flex items-center ${isActive("/treinos")}`}>
              <DumbbellIcon className="h-5 w-5 mr-1" />
              <span>Treinos</span>
            </Link>
            <Link href="/perfil" className={`flex items-center ${isActive("/perfil")}`}>
              <UserIcon className="h-5 w-5 mr-1" />
              <span>Perfil</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/calendario"
              className={`block px-3 py-2 rounded-md ${isActive("/calendario") ? "bg-blue-50" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>Calendário</span>
              </div>
            </Link>
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md ${isActive("/dashboard") ? "bg-blue-50" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <BarChart3Icon className="h-5 w-5 mr-2" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link
              href="/treinos"
              className={`block px-3 py-2 rounded-md ${isActive("/treinos") ? "bg-blue-50" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <DumbbellIcon className="h-5 w-5 mr-2" />
                <span>Treinos</span>
              </div>
            </Link>
            <Link
              href="/perfil"
              className={`block px-3 py-2 rounded-md ${isActive("/perfil") ? "bg-blue-50" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>Perfil</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
