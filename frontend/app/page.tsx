import Link from "next/link"
import { CalendarIcon, BarChart3Icon, DumbbellIcon, UserIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Acompanhamento de Treinos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/calendario"
          className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
        >
          <div className="bg-blue-100 p-3 rounded-full">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Calendário</h2>
            <p className="text-gray-600">Visualize seus treinos agendados</p>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
        >
          <div className="bg-green-100 p-3 rounded-full">
            <BarChart3Icon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <p className="text-gray-600">Acompanhe seu progresso</p>
          </div>
        </Link>

        <Link
          href="/treinos"
          className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 p-3 rounded-full">
            <DumbbellIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Treinos</h2>
            <p className="text-gray-600">Gerencie seus treinos</p>
          </div>
        </Link>

        <Link
          href="/perfil"
          className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
        >
          <div className="bg-orange-100 p-3 rounded-full">
            <UserIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Perfil</h2>
            <p className="text-gray-600">Atualize suas informações</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
