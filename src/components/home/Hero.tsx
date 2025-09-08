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
  style: z.string().min(1, 'Style is required.'),
  colorPalette: z.string().min(1, 'Color palette is required.'),
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
          title: 'Image Generated!',
          description: 'The new hero image has been set.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate a new image. Please try again.',
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
        alt="Hero background"
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
          A Creative Technologist & Designer Crafting Modern Digital Experiences.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <a href="#portfolio">View My Work</a>
          </Button>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="absolute bottom-4 right-4 bg-background/80 hover:bg-background"
          >
            Generate Image
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Generate Hero Image</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="minimalist">Minimalist</SelectItem>
                            <SelectItem value="abstract">Abstract</SelectItem>
                            <SelectItem value="realistic">Realistic</SelectItem>
                            <SelectItem value="vibrant">Vibrant</SelectItem>
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
                        <FormLabel>Color Palette</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a color palette" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="warm">Warm</SelectItem>
                            <SelectItem value="cool">Cool</SelectItem>
                            <SelectItem value="monochromatic">Monochromatic</SelectItem>
                            <SelectItem value="pastel">Pastel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isGenerating} className="w-full">
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate
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
