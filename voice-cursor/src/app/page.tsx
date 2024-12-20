/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";

import dynamic from "next/dynamic";
import type { JSONContent } from "novel";
import { useState, useEffect } from "react";
import { defaultValue } from "./default-value";

const EditorWrapper = dynamic(() => import("@/components/editor/client-editor"), {
  ssr: false
});

// Helper function to extract audio keys from the default value
const extractAudioKeys = (content: any[]): string[] => {
  const audioKeys: string[] = [];
  
  const traverse = (node: any) => {
    if (node.content) {
      node.content.forEach(traverse);
    }
    
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        if (mark.type === 'highlight' && mark.attrs.audioKey) {
          audioKeys.push(mark.attrs.audioKey);
        }
      });
    }
  };

  content.forEach(traverse);
  return Array.from(new Set(audioKeys)); // Remove duplicates
};

export default function Home() {
  const [value, setValue] = useState<JSONContent>(defaultValue);
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Initialize the audio blobs for all highlighted text
  useEffect(() => {
    let mounted = true;
    console.log('🎵 Starting to initialize audio files...');

    const initializeDefaultAudios = async () => {
      if (typeof window === 'undefined') return;

      // Wait for EditorContext to be available
      if (!(window as any).editorContext) {
        console.log('Waiting for EditorContext...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!(window as any).editorContext) {
        console.error('EditorContext not available after waiting');
        return;
      }

      console.log('EditorContext available, loading audio files...');

      // Extract audio keys from default value
      const audioKeys = extractAudioKeys(defaultValue.content);
      console.log('Found audio keys:', audioKeys);

      for (const audioKey of audioKeys) {
        try {
          const filename = `${audioKey}.wav`;
          console.log(`Loading audio file: ${filename}`);

          // Fetch the audio file
          const response = await fetch(`/audio/${filename}`);
          if (!response.ok) {
            throw new Error(`Failed to load audio file: ${filename}`);
          }

          // Get the audio data as a blob
          const audioBlob = await response.blob();
          console.log(`Successfully loaded ${filename}:`, {
            size: audioBlob.size,
            type: audioBlob.type
          });

          // Store in EditorContext
          (window as any).editorContext.setAudioBlob(audioKey, audioBlob);
          console.log(`Stored audio blob for ${audioKey}`);

          // Test that we can access it
          const storedBlob = (window as any).editorContext.audioBlobs.get(audioKey);
          console.log(`Verification - Retrieved blob for ${audioKey}:`, {
            exists: Boolean(storedBlob),
            size: storedBlob?.size,
            type: storedBlob?.type
          });

        } catch (error) {
          console.error(`Error loading audio for ${audioKey}:`, error);
        }
      }

      if (mounted) {
        setInitializationComplete(true);
      }
    };

    initializeDefaultAudios();

    return () => {
      mounted = false;
    };
  }, []);

  // Log when initialization is complete
  useEffect(() => {
    if (initializationComplete) {
      console.log('🎵 Audio initialization complete. Available audio:',
        Array.from((window as any).editorContext?.audioBlobs?.keys() || []));
    }
  }, [initializationComplete]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <EditorWrapper initialValue={value} onChange={setValue} />
      <div className="fixed bottom-0 left-0 w-fit text-left bg-transparent p-4 text-black flex justify-between items-center">
        <p className="text-sm text-muted-foreground text-left">Powered by 
          <br /> <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline">Gemini 2.0 Native Audio</a></p>
      </div>
    </main>
  );
}
