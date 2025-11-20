'use server';
/**
 * @fileOverview A flow for generating signed URLs for Google Cloud Storage uploads.
 * This allows clients to upload files directly to GCS without needing server credentials.
 *
 * - getSignedUrl - A function that returns a signed URL for a given file path and content type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Storage } from '@google-cloud/storage';
import { firebaseConfig } from '@/firebase/config';

const GetSignedUrlInputSchema = z.object({
  filePath: z.string().describe('The full path in GCS where the file will be uploaded.'),
  contentType: z.string().describe('The MIME type of the file to be uploaded.'),
});
export type GetSignedUrlInput = z.infer<typeof GetSignedUrlInputSchema>;

const GetSignedUrlOutputSchema = z.object({
  signedUrl: z.string().describe('The signed URL for the upload.'),
});
export type GetSignedUrlOutput = z.infer<typeof GetSignedUrlOutputSchema>;

// This function is exported and called from the client
export async function getSignedUrl(input: GetSignedUrlInput): Promise<GetSignedUrlOutput> {
  return getSignedUrlFlow(input);
}

const getSignedUrlFlow = ai.defineFlow(
  {
    name: 'getSignedUrlFlow',
    inputSchema: GetSignedUrlInputSchema,
    outputSchema: GetSignedUrlOutputSchema,
  },
  async ({ filePath, contentType }) => {
    const storage = new Storage();
    const bucketName = firebaseConfig.storageBucket;
    
    if (!bucketName) {
        throw new Error("Firebase storage bucket is not configured.");
    }

    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);

    return { signedUrl: url };
  }
);
