import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function FinalizarPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-10 pb-6 flex flex-col items-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Parabéns!</h1>
          <p className="text-gray-600 mb-6">Você completou seu treino com sucesso. Continue assim!</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Voltar</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
