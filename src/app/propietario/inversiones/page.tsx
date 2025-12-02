'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Landmark } from 'lucide-react';

export default function InversionesPage() {
  return (
    <div className="flex-1 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Inversiones</CardTitle>
          <CardDescription>
            Visualiza y gestiona tus inversiones y rendimientos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-dashed border-2 rounded-lg">
            <Landmark className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              La sección de inversiones se implementará en la siguiente fase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
