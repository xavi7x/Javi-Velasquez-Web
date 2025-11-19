'use client';

import { useState } from 'react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle, FileText, Inbox, Link as LinkIcon, Phone, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  submissionDate: string; // ISO string
  status: 'new' | 'read' | 'archived';
  attachmentUrl?: string;
  url?: string;
}

export function MessagesView() {
  const firestore = useFirestore();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contactFormSubmissions'), orderBy('submissionDate', 'desc'));
  }, [firestore]);

  const { data: messages, isLoading, error } = useCollection<Message>(messagesQuery);

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-16 rounded-full inline-block" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-48 text-center">
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-destructive">Error al cargar los mensajes.</p>
                <p className="text-sm text-muted-foreground max-w-sm">{error.message}</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    
    if (!messages || messages.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <Inbox className="h-12 w-12 text-muted-foreground" />
                            <h3 className="font-semibold">Bandeja de entrada vacía</h3>
                            <p className="text-muted-foreground">Aún no has recibido ningún mensaje.</p>
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }

    return (
      <TableBody>
        {messages.map((msg) => (
          <TableRow key={msg.id}>
            <TableCell className="font-medium">{msg.name}</TableCell>
            <TableCell className="text-muted-foreground">{msg.phone}</TableCell>
            <TableCell className="max-w-[300px] truncate text-muted-foreground">
              {msg.message || <span className="italic text-muted-foreground/60">Sin mensaje de texto</span>}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {format(new Date(msg.submissionDate), "dd MMM yyyy", { locale: es })}
            </TableCell>
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
              {msg.attachmentUrl && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4"/>
                    Adjunto
                  </Link>
                </Button>
              )}
               {msg.url && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href={msg.url} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="mr-2 h-4 w-4"/>
                    URL
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSelectedMessage(msg)}>Ver</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Bandeja de Entrada</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
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
            {renderContent()}
          </Table>
        </div>
      </CardContent>
    </Card>

    {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={(isOpen) => !isOpen && setSelectedMessage(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detalle del Mensaje</DialogTitle>
                    <div className="!mt-2">
                        <Badge
                            variant={
                                selectedMessage.status === 'new' ? 'default' : selectedMessage.status === 'read' ? 'secondary' : 'outline'
                            }
                        >
                            {selectedMessage.status === 'new' ? 'Nuevo' : selectedMessage.status === 'read' ? 'Leído' : 'Archivado'}
                        </Badge>
                    </div>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div className='text-sm'>
                            <p className="font-medium text-muted-foreground">Nombre</p>
                            <p>{selectedMessage.name}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div className='text-sm'>
                            <p className="font-medium text-muted-foreground">Teléfono</p>
                            <p>{selectedMessage.phone}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div className='text-sm'>
                            <p className="font-medium text-muted-foreground">Fecha</p>
                            <p>{format(new Date(selectedMessage.submissionDate), "PPP p", { locale: es })}</p>
                        </div>
                    </div>
                    {selectedMessage.message && (
                        <div className='space-y-2'>
                            <p className="font-medium text-sm text-muted-foreground">Mensaje</p>
                            <p className="text-sm p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>
                    )}
                    {(selectedMessage.attachmentUrl || selectedMessage.url) && (
                        <div className='space-y-3'>
                            <p className="font-medium text-sm text-muted-foreground">Recursos Adicionales</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedMessage.attachmentUrl && (
                                    <Button asChild variant="outline" size="sm" className='rounded-full'>
                                        <Link href={selectedMessage.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                            <FileText className="mr-2 h-4 w-4" /> Ver Archivo Adjunto
                                        </Link>
                                    </Button>
                                )}
                                {selectedMessage.url && (
                                    <Button asChild variant="outline" size="sm" className='rounded-full'>
                                        <Link href={selectedMessage.url} target="_blank" rel="noopener noreferrer">
                                            <LinkIcon className="mr-2 h-4 w-4" /> Visitar URL
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cerrar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )}
    </>
  );
}
