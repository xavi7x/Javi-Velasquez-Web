'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';

// Datos de ejemplo
const messages = [
  {
    id: 'msg001',
    name: 'Ana García',
    phone: '+1 123 456 7890',
    message: 'Hola, estoy interesada en una tienda online. ¿Podemos hablar?',
    date: '2024-07-28',
    status: 'new',
  },
  {
    id: 'msg002',
    name: 'Carlos Rodriguez',
    phone: '+1 987 654 3210',
    message: 'Necesito una aplicación web para mi negocio. Mi idea es...',
    date: '2024-07-27',
    status: 'read',
  },
  {
    id: 'msg003',
    name: 'Laura Fernandez',
    phone: '+1 555 867 5309',
    message: 'Me gustaría cotizar el desarrollo de una página web sencilla.',
    date: '2024-07-26',
    status: 'archived',
  },
];

export function MessagesView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bandeja de Entrada</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell className="font-medium">{msg.name}</TableCell>
                <TableCell className="text-muted-foreground">{msg.phone}</TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {msg.message}
                </TableCell>
                <TableCell className="text-muted-foreground">{msg.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      msg.status === 'new'
                        ? 'default'
                        : msg.status === 'read'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {msg.status === 'new' ? 'Nuevo' : msg.status === 'read' ? 'Leído' : 'Archivado'}
                  </Badge>
                </TableCell>
                 <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="rounded-full">Ver</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
