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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Client } from '@/lib/project-types';
import { PlusCircle, Trash, Loader2, Copy } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const emptyClient: Partial<Client> = {
  name: '',
  email: '',
  companyName: '',
};

export function ClientsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firestore = useFirestore();

  const clientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'clients'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: clients, isLoading } = useCollection<Client>(clientsQuery);

  const openAddModal = () => {
    setEditingClient(emptyClient);
    setIsEditing(false);
    setIsModalOpen(true);
    setNewPassword('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firestore || !editingClient || !editingClient.name || !editingClient.email) {
        toast({ variant: "destructive", title: "Error", description: "El nombre y el email son obligatorios." });
        return;
    }
    
    if (isEditing) {
        // TODO: Implement editing logic if needed. For now, we only create.
        // It would involve a cloud function to update user email, or just updating Firestore data.
        return;
    }
    
    setIsSubmitting(true);
    
    try {
        const functions = getFunctions();
        const createClientUser = httpsCallable(functions, 'createClientUser');

        const password = Math.random().toString(36).slice(-8);

        const result = await createClientUser({
            email: editingClient.email,
            password: password,
            displayName: editingClient.name,
        });

        const { uid } = (result.data as { uid: string });

        const clientData = {
            uid: uid,
            id: uid,
            name: editingClient.name,
            email: editingClient.email,
            companyName: editingClient.companyName || '',
        };

        const clientRef = doc(firestore, 'clients', uid);
        await setDoc(clientRef, clientData);

        setNewPassword(password);
        toast({
            title: "Cliente creado",
            description: `Se ha creado la cuenta para ${clientData.name}.`
        });
        // Keep modal open to show password

    } catch (error: any) {
        console.error("Error creating client:", error);
        toast({ variant: 'destructive', title: 'Error al crear cliente', description: error.message });
        setIsSubmitting(false); // only stop submitting on error
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete || !firestore) return;
    
    // We'll need a cloud function to delete the Firebase Auth user.
    // For now, we just delete the Firestore record.
    try {
      const clientRef = doc(firestore, 'clients', clientToDelete.id);
      await deleteDoc(clientRef);
      toast({ title: "Cliente eliminado", description: `"${clientToDelete.name}" ha sido eliminado de Firestore.` });
    } catch(error) {
      const contextualError = new FirestorePermissionError({
          path: `clients/${clientToDelete.id}`,
          operation: 'delete',
      });
      errorEmitter.emit('permission-error', contextualError);
    } finally {
      setClientToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setIsSubmitting(false);
    setNewPassword('');
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Contraseña copiada al portapapeles." });
  }

  const modalTitle = isEditing ? 'Editar Cliente' : 'Añadir Nuevo Cliente';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Clientes Activos</CardTitle>
            <CardDescription>Lista de todos los clientes con acceso al portal.</CardDescription>
          </div>
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Cliente
          </Button>
        </CardHeader>
        <CardContent>
           <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Empresa</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-9 w-9 rounded-full inline-block" /></TableCell>
                        </TableRow>
                    ))
                ) : clients?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No hay clientes. Empieza añadiendo uno.
                        </TableCell>
                    </TableRow>
                ) : clients?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium max-w-xs truncate">{client.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{client.email}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate hidden sm:table-cell">
                      {client.companyName || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setClientToDelete(client)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingClient && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
              <DialogDescription>
                Crea una cuenta para que un nuevo cliente pueda acceder a su portal.
              </DialogDescription>
            </DialogHeader>
            {newPassword ? (
                 <div className="space-y-4 py-4">
                    <p>¡Usuario creado con éxito! Comparte esta contraseña temporal con tu cliente.</p>
                    <div className="flex items-center space-x-2">
                        <Input id="new-password" value={newPassword} readOnly className="font-mono"/>
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(newPassword)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">El cliente podrá cambiar esta contraseña desde su perfil.</p>
                 </div>
            ) : (
                <form onSubmit={handleFormSubmit} id="client-form" className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input id="name" value={editingClient.name || ''} onChange={e => setEditingClient({...editingClient, name: e.target.value})} placeholder="Ej: John Doe" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={editingClient.email || ''} onChange={e => setEditingClient({...editingClient, email: e.target.value})} placeholder="cliente@email.com" disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Nombre de la Empresa</Label>
                        <Input id="companyName" value={editingClient.companyName || ''} onChange={e => setEditingClient({...editingClient, companyName: e.target.value})} placeholder="Ej: Acme Inc." disabled={isSubmitting}/>
                    </div>
                </form>
            )}

            <DialogFooter>
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cerrar
                </Button>
              {!newPassword && (
                <Button type="submit" form="client-form" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? 'Creando...' : 'Crear Cliente'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <AlertDialog open={!!clientToDelete} onOpenChange={(isOpen) => !isOpen && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el registro del cliente de la base de datos.
              Por ahora, no elimina al usuario de Firebase Authentication.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient}>
              Sí, eliminar cliente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
