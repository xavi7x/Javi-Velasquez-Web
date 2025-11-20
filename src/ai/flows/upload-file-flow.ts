'use server';
/**
 * @fileOverview A flow to upload files to Firebase Storage.
 * This flow acts as a server-side proxy to bypass CORS issues when uploading from the client.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
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
    const bucket = admin.storage().bucket();

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

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // A far-future date
    });
    
    // Convert the signed URL to a public, un-authenticated URL format.
    // This is a common pattern for Firebase Storage URLs.
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;

    return { downloadUrl: publicUrl };
  }
);
