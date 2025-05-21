"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "axios";

// URL base da API
const API_URL = 'http://localhost:8000/api/v1';

export default function ApiStatus() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkApiStatus = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const { data } = await axios.get(`${API_URL}/auth/ping`);
      setResponse(data);
      setStatus('online');
    } catch (err) {
      setStatus('offline');
      if (axios.isAxiosError(err)) {
        setError(`${err.message}${err.response ? ` - Status: ${err.response.status}` : ''}`);
      } else {
        setError('Erro desconhecido');
      }
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status da API</CardTitle>
        <CardDescription>Verifica a conexão com o backend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span>Status:</span>
            {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
            {status === 'online' && <span className="text-green-500 font-medium">Online</span>}
            {status === 'offline' && <span className="text-red-500 font-medium">Offline</span>}
          </div>
          
          {error && (
            <div className="mt-2 text-red-500 text-sm">
              <p>Erro: {error}</p>
            </div>
          )}
          
          {response && (
            <div className="mt-2 bg-gray-50 rounded p-2 text-sm">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkApiStatus} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : 'Verificar Novamente'}
        </Button>
      </CardFooter>
    </Card>
  );
}
