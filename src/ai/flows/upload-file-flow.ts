'use server';
/**
 * @fileOverview A flow to upload files to Firebase Storage.
 * This flow acts as a server-side proxy to bypass CORS issues when uploading from the client.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
    initializeApp({
        storageBucket: firebaseConfig.storageBucket,
    });
}

const UploadFileInputSchema = z.object({
  fileDataUri: z.string().describe('The file encoded as a data URI.'),
  filePath: z.string().describe('The destination path in Firebase Storage.'),
});
export type UploadFileInput = z.infer<typeof UploadFileInputSchema>;

const UploadFileOutputSchema = z.object({
  downloadUrl: z.string().describe('The public URL of the uploaded file.'),
});
export type UploadFileOutput = z.infer<typeof UploadFileOutputSchema>;

export async function uploadFile(
  input: UploadFileInput
): Promise<UploadFileOutput> {
  return uploadFileFlow(input);
}

const uploadFileFlow = ai.defineFlow(
  {
    name: 'uploadFileFlow',
    inputSchema: UploadFileInputSchema,
    outputSchema: UploadFileOutputSchema,
  },
  async ({ fileDataUri, filePath }) => {
    const bucket = getStorage().bucket();

    // Extract content type and base64 data from data URI
    const match = fileDataUri.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      throw new Error('Invalid data URI format.');
    }
    const contentType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const file = bucket.file(filePath);

    await file.save(buffer, {
      metadata: {
        contentType,
        cacheControl: 'public,max-age=31536000',
      },
    });

    // Make the file public to get a predictable URL
    await file.makePublic();

    // Construct the public, un-authenticated URL format.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return { downloadUrl: publicUrl };
  }
);
