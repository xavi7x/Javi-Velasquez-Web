'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente.',
      });
      router.push('/propietario');
    } catch (error: any) {
      setError(
        'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-sm bg-white/50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 backdrop-blur-xl">
          <CardHeader className="items-center text-center">
            <Image
              src={logoUrl}
              alt="Logo Javier Velasquez"
              width={40}
              height={40}
              className="h-10 w-10 object-contain mb-4"
            />
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error de autenticación</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white text-neutral-900 placeholder:text-neutral-500"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white text-neutral-900 placeholder:text-neutral-500"
                />
              </div>
              <Button type="submit" className={cn("w-full", "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:brightness-110")} disabled={isLoading}>
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
