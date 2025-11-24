
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
import { Switch } from '@/components/ui/switch';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/velsquez-digital.firebasestorage.app/o/Private%2Flogo-javier.svg?alt=media&token=7d179ca6-55ad-4a5f-9cf6-e6050f004630';
  const ownerEmail = 'xavi7x@gmail.com'; // Admin email

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!auth || !firestore) {
        setError("Servicios de autenticación no disponibles.");
        setIsLoading(false);
        return;
    }

    try {
      // Set session persistence
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Special logic for the owner
      if (user.email === ownerEmail) {
        const ownerDocRef = doc(firestore, 'owners', user.uid);
        const ownerDoc = await getDoc(ownerDocRef);
        if (!ownerDoc.exists()) {
          // This is the first login for the owner, create the owner document
          await setDoc(ownerDocRef, {
            uid: user.uid,
            email: user.email,
          });
        }
        toast({
          title: '¡Bienvenido, Propietario!',
          description: 'Has iniciado sesión correctamente.',
        });
        router.push('/propietario');
        return; // Stop execution here
      }

      // Check for client role
      const clientDocRef = doc(firestore, 'clients', user.uid);
      const clientDoc = await getDoc(clientDocRef);
      if (clientDoc.exists()) {
           toast({
              title: '¡Bienvenido de vuelta!',
              description: 'Has iniciado sesión en tu portal.',
          });
          router.push('/portal/dashboard');
      } else {
          // If user exists in Auth but not in owners or clients collection
          setError('No tienes un rol asignado. Contacta al administrador.');
          await auth.signOut();
      }

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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-white text-neutral-900 placeholder:text-neutral-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
               <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Switch 
                        id="remember-me" 
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                        disabled={isLoading}
                    />
                    <Label htmlFor="remember-me">Mantener sesión</Label>
                </div>
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
