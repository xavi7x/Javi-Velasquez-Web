'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RequestsPage() {
  return (
    <div className="flex-1 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tablero de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El tablero de tickets se implementará en la siguiente fase.</p>
        </CardContent>
      </Card>
    </div>
  );
}
