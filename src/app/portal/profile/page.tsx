'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Actualiza tus datos de contacto y facturación.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El formulario de perfil se implementará en la siguiente fase.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    