'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { generateHeroImage } from '@/ai/flows/generate-hero-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  style: z.string().min(1, 'El estilo es obligatorio.'),
  colorPalette: z.string().min(1, 'La paleta de colores es obligatoria.'),
});

export function Hero() {
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/1920/1080?random=hero');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      style: 'minimalist',
      colorPalette: 'warm',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const result = await generateHeroImage(values);
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        toast({
          title: '¡Imagen Generada!',
          description: 'La nueva imagen de héroe ha sido establecida.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falló la Generación',
        description: 'No se pudo generar una nueva imagen. Por favor, inténtalo de nuevo.',
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="relative flex h-[80vh] min-h-[600px] w-full items-center justify-center text-center">
      <Image
        src={imageUrl}
        alt="Fondo de héroe"
        fill
        className="-z-10 object-cover"
        data-ai-hint="background texture"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />

      <div className="container px-4 text-white md:px-6">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Velásquez Digital
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-gray-200 md:text-xl">
          Un Tecnólogo Creativo y Diseñador Creando Experiencias Digitales Modernas.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <a href="#portfolio">Ver Mi Trabajo</a>
          </Button>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="absolute bottom-4 right-4 bg-background/80 hover:bg-background"
          >
            Generar Imagen
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Generar Imagen de Héroe</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estilo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un estilo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="minimalist">Minimalista</SelectItem>
                            <SelectItem value="abstract">Abstracto</SelectItem>
                            <SelectItem value="realistic">Realista</SelectItem>
                            <SelectItem value="vibrant">Vibrante</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="colorPalette"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paleta de Colores</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una paleta de colores" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="warm">Cálida</SelectItem>
                            <SelectItem value="cool">Fría</SelectItem>
                            <SelectItem value="monochromatic">Monocromática</SelectItem>
                            <SelectItem value="pastel">Pastel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isGenerating} className="w-full">
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generar
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </section>
  );
}
