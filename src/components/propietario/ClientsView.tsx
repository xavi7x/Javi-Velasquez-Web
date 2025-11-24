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
import { PlusCircle, Trash, Loader2, Copy, Edit, KeyRound } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useAuth } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { initializeApp, getApps, getApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
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
  const auth = useAuth();

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
  
  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setIsEditing(true);
    setIsModalOpen(true);
    setNewPassword('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firestore || !editingClient || !editingClient.name || !editingClient.email) {
        toast({ variant: "destructive", title: "Error", description: "El nombre y el email son obligatorios." });
        return;
    }
    
    setIsSubmitting(true);

    if (isEditing) {
        if (!editingClient.id) {
          setIsSubmitting(false);
          return;
        };

        try {
            const clientRef = doc(firestore, 'clients', editingClient.id);
            const clientDataToUpdate = {
                name: editingClient.name,
                companyName: editingClient.companyName || '',
                email: editingClient.email, // email is readonly in form but we pass it
            };
            await setDoc(clientRef, clientDataToUpdate, { merge: true });
            toast({
                title: "Cliente actualizado",
                description: `Los datos de ${editingClient.name} han sido actualizados.`
            });
            closeModal();
        } catch (error: any) {
            console.error("Error updating client:", error);
            const contextualError = new FirestorePermissionError({
                path: `clients/${editingClient.id}`,
                operation: 'update',
                requestResourceData: { name: editingClient.name, companyName: editingClient.companyName },
            });
            errorEmitter.emit('permission-error', contextualError);
        } finally {
            setIsSubmitting(false);
        }
        return;
    }
    
    // Logic for creating a new client
    // Create a secondary Firebase app instance to create the user
    const tempAppName = `temp-client-creation-${Date.now()}`;
    const tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp);
    
    try {
        const password = Math.random().toString(36).slice(-8);
        const userCredential = await createUserWithEmailAndPassword(tempAuth, editingClient.email, password);
        const user = userCredential.user;
        
        await signOut(tempAuth); // Sign out the new user from the temporary instance

        const clientData = {
            uid: user.uid,
            id: user.uid,
            name: editingClient.name,
            email: editingClient.email,
            companyName: editingClient.companyName || '',
        };

        const clientRef = doc(firestore, 'clients', user.uid);
        await setDoc(clientRef, clientData);

        setNewPassword(password);
        toast({
            title: "Cliente creado",
            description: `Se ha creado la cuenta para ${clientData.name}.`
        });
        // Keep modal open to show password

    } catch (error: any) {
        console.error("Error creating client:", error);
        let description = 'Ocurrió un error inesperado.';
        if (error.code === 'auth/email-already-in-use') {
            description = 'El correo electrónico ya está en uso por otra cuenta.';
        } else if (error.code === 'auth/invalid-email') {
            description = 'El formato del correo electrónico no es válido.';
        }
        toast({ variant: 'destructive', title: 'Error al crear cliente', description: description });
        setIsSubmitting(false); // only stop submitting on error
    } finally {
        // Clean up the temporary app
        await deleteApp(tempApp);
    }
  };

  const handlePasswordReset = async () => {
    if (!auth || !editingClient || !editingClient.email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se puede reiniciar la contraseña sin un correo electrónico de cliente.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, editingClient.email);
      toast({
        title: 'Correo enviado',
        description: `Se ha enviado un correo de reinicio de contraseña a ${editingClient.email}.`,
      });
      closeModal();
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      toast({
        variant: 'destructive',
        title: 'Error al enviar correo',
        description: error.message || 'Ocurrió un error inesperado.',
      });
    } finally {
      setIsSubmitting(false);
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
  const modalDescription = isEditing ? 'Modifica los datos del cliente. El email no se puede cambiar.' : 'Crea una cuenta para que un nuevo cliente pueda acceder a su portal.';


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
                            <TableCell className="text-right space-x-2">
                                <Skeleton className="h-9 w-9 rounded-full inline-block" />
                                <Skeleton className="h-9 w-9 rounded-full inline-block" />
                            </TableCell>
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
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => openEditModal(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => !isOpen && closeModal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
              <DialogDescription>
                {modalDescription}
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
                        <Input id="email" type="email" value={editingClient.email || ''} onChange={e => setEditingClient({...editingClient, email: e.target.value})} placeholder="cliente@email.com" disabled={isSubmitting || isEditing} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Nombre de la Empresa</Label>
                        <Input id="companyName" value={editingClient.companyName || ''} onChange={e => setEditingClient({...editingClient, companyName: e.target.value})} placeholder="Ej: Acme Inc." disabled={isSubmitting}/>
                    </div>
                </form>
            )}

            <DialogFooter className="sm:justify-between">
              {isEditing && (
                 <Button type="button" variant="outline" onClick={handlePasswordReset} disabled={isSubmitting}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Reiniciar Contraseña
                 </Button>
              )}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={closeModal} className={isEditing ? 'hidden' : ''}>
                  {newPassword ? 'Cerrar' : 'Cancelar'}
                </Button>
                {!newPassword && (
                  <Button type="submit" form="client-form" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSubmitting ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar Cambios' : 'Crear Cliente')}
                  </Button>
                )}
              </div>
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
