'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClientDashboardPage() {

  // Mock data - replace with real data from Firestore
  const clientName = "Cliente"; 
  const activeProject = { name: 'Desarrollo App Móvil', status: 'En Progreso' };
  const pendingPayments = { amount: '$500.000' };
  const nextMilestone = { date: '25 de Diciembre, 2024' };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hola, {clientName}</h1>
        <p className="text-muted-foreground">Bienvenido a tu portal de cliente.</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Proyecto Activo</CardTitle>
            <CardDescription>{activeProject.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {activeProject.status}
              </span>
              <Button asChild variant="outline" size="sm">
                <Link href="/portal/projects/1">Ver Detalles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pagos Pendientes</CardTitle>
            <CardDescription>Facturas que requieren tu atención.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{pendingPayments.amount}</span>
              <Button asChild variant="default" size="sm">
                <Link href="/portal/invoices">Ir a Finanzas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximo Hito</CardTitle>
            <CardDescription>Fecha clave en tu proyecto.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{nextMilestone.date}</span>
                <Button asChild variant="secondary" size="sm">
                    <Link href="/portal/projects/1">Ver Cronograma</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col justify-center items-center p-6 text-center">
                <CardHeader>
                    <CardTitle>¿Necesitas un cambio?</CardTitle>
                    <CardDescription>Crea una nueva solicitud para ajustes, cambios o nuevas ideas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg">
                        <Link href="/portal/requests/new">Crear Solicitud</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-center items-center p-6 text-center">
                <CardHeader>
                    <CardTitle>Acceso a tus Archivos</CardTitle>
                    <CardDescription>Encuentra todos los entregables, logos y documentos importantes aquí.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/portal/projects/1?tab=files">Ir a Archivos</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}

    