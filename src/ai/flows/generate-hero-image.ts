'use server';

/**
 * @fileOverview Dynamically generates hero background images based on user preferences using generative AI.
 *
 * - generateHeroImage - A function that generates a hero image based on given preferences.
 * - GenerateHeroImageInput - The input type for the generateHeroImage function.
 * - GenerateHeroImageOutput - The return type for the generateHeroImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHeroImageInputSchema = z.object({
  style: z
    .string()
    .describe('The style of the image (e.g., minimalist, abstract, realistic).'),
  colorPalette: z
    .string()
    .describe('The color palette to use (e.g., warm, cool, monochromatic).'),
});
export type GenerateHeroImageInput = z.infer<typeof GenerateHeroImageInputSchema>;

const GenerateHeroImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated hero image.'),
});
export type GenerateHeroImageOutput = z.infer<typeof GenerateHeroImageOutputSchema>;

export async function generateHeroImage(
  input: GenerateHeroImageInput
): Promise<GenerateHeroImageOutput> {
  return generateHeroImageFlow(input);
}

const generateHeroImagePrompt = ai.definePrompt({
  name: 'generateHeroImagePrompt',
  input: {schema: GenerateHeroImageInputSchema},
  output: {schema: GenerateHeroImageOutputSchema},
  prompt: `Generate a hero background image with the following characteristics:

Style: {{{style}}}
Color Palette: {{{colorPalette}}}

Ensure the image is visually appealing and suitable for a hero section of a website.`,
});

const generateHeroImageFlow = ai.defineFlow(
  {
    name: 'generateHeroImageFlow',
    inputSchema: GenerateHeroImageInputSchema,
    outputSchema: GenerateHeroImageOutputSchema,
  },
  async input => {
    // TEMPORARY FIX: Return a placeholder image to avoid Imagen API billing error.
    // Replace this with the original implementation when billing is enabled.
    return {
      imageUrl: `https://picsum.photos/1920/1080?random=${Math.random()}`,
    };
  }
);
