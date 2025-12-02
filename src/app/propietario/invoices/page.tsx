'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-8">
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
