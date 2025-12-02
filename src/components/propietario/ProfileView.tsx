'use client';

import { useState, useEffect, useRef, type FormEvent, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useDoc, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Trash, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

interface AboutContent {
  headline: string;
  subheadline: string;
  mainParagraph: string;
  imageUrl: string;
}

const defaultContent: AboutContent = {
  headline: "Transformando Ideas en Código",
  subheadline: "Soy Javier, un desarrollador apasionado por construir productos digitales que sean eficientes, escalables y resuelvan problemas reales.",
  mainParagraph: "Me apasiona la intersección entre la creatividad y la tecnología...",
  imageUrl: "https://picsum.photos/seed/101/600/800"
};

export function ProfileView() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [formData, setFormData] = useState<AboutContent>(defaultContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aboutContentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'about');
  }, [firestore]);

  const { data: aboutContent, isLoading } = useDoc<AboutContent>(aboutContentRef);

  useEffect(() => {
    if (aboutContent) {
      setFormData(aboutContent);
    }
  }, [aboutContent]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const storage = getStorage();
        const path = `profile-images/${user.uid}/${Date.now()}_${file.name}`;
        const fileRef = storageRef(storage, path);
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
        toast({ title: 'Imagen subida', description: 'La nueva imagen de perfil ha sido cargada.' });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({ variant: 'destructive', title: 'Error de carga', description: 'No se pudo subir la imagen.' });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!aboutContentRef) return;

    setIsSubmitting(true);
    try {
      await setDoc(aboutContentRef, formData, { merge: true });
      toast({
        title: 'Perfil actualizado',
        description: 'El contenido de la página "Sobre mí" ha sido guardado.',
      });
    } catch (error) {
       const contextualError = new FirestorePermissionError({
          path: aboutContentRef.path,
          operation: 'update',
          requestResourceData: formData
      });
      errorEmitter.emit('permission-error', contextualError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-20 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-20 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-40 w-40 rounded-lg" />
                </div>
                 <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Contenido de la Página "Sobre Mí"</CardTitle>
          <CardDescription>
            Edita los textos y la imagen que aparecen en tu página de presentación.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Título Principal</Label>
            <Input id="headline" value={formData.headline} onChange={handleChange} disabled={isSubmitting} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subheadline">Subtítulo</Label>
            <Textarea id="subheadline" value={formData.subheadline} onChange={handleChange} disabled={isSubmitting} className="min-h-[80px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainParagraph">Párrafo Principal</Label>
            <Textarea id="mainParagraph" value={formData.mainParagraph} onChange={handleChange} disabled={isSubmitting} className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label>Imagen de Perfil</Label>
            <div className="flex items-center gap-4">
                <div className="relative w-32 h-40 rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
                    {formData.imageUrl ? (
                        <Image src={formData.imageUrl} alt="Perfil" layout="fill" objectFit="cover" />
                    ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>
                <div className='space-y-2'>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading || isSubmitting} variant="outline">
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isUploading ? 'Subiendo...' : 'Cambiar Imagen'}
                    </Button>
                    <p className="text-xs text-muted-foreground">Recomendado: 600x800px, JPG o PNG.</p>
                </div>
            </div>
          </div>
           <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
