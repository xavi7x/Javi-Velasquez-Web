'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function FinancesPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
        <p className="text-muted-foreground">
          Revisa el historial de pagos y facturas.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>El centro financiero se implementará en la siguiente fase.</p>
        </CardContent>
      </Card>
    </div>
  );
}
