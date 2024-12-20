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

import { useState, useEffect } from "react";

// Voice options based on the API documentation
const VOICE_OPTIONS = {
  "Named Voices": ["Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda", "Orus", "Gemini H"]
};

export default function TestAudio() {
  const [input, setInput] = useState('Say in a cheerful tone: "Hello world, how are you today?"');
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("Kore");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorDetails("");
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: input }]
            }],
            generationConfig: {
              response_modalities: ["AUDIO"],
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: selectedVoice
                  }
                }
              }
            }
          })
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        throw new Error('No audio data received in response');
      }

      const base64Audio = data.candidates[0].content.parts[0].inlineData.data;
      console.log("Base64 Audio:", base64Audio);

      // Parse the audio format parameters
      const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType || 'audio/wav';
      const mimeParams = mimeType.split(';').reduce((acc: Record<string, string>, param: string) => {
        const [key, value] = param.split('=');
        if (value) {
          acc[key.trim()] = value.trim();
        } else {
          acc.mimeBase = key.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      console.log("MIME params:", mimeParams);

      // Convert base64 to PCM audio data
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create WAV header for PCM data
      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);

      // "RIFF" chunk descriptor
      view.setUint32(0, 0x52494646, false); // "RIFF"
      view.setUint32(4, 36 + byteArray.length, true); // file length
      view.setUint32(8, 0x57415645, false); // "WAVE"

      // "fmt " sub-chunk
      view.setUint32(12, 0x666D7420, false); // "fmt "
      view.setUint32(16, 16, true); // subchunk size
      view.setUint16(20, 1, true); // PCM audio format
      view.setUint16(22, 1, true); // Mono channel
      view.setUint32(24, parseInt(mimeParams.rate) || 24000, true); // sample rate
      view.setUint32(28, (parseInt(mimeParams.rate) || 24000) * 2, true); // byte rate
      view.setUint16(32, 2, true); // block align
      view.setUint16(34, 16, true); // bits per sample

      // "data" sub-chunk
      view.setUint32(36, 0x64617461, false); // "data"
      view.setUint32(40, byteArray.length, true); // data length

      // Combine header and PCM data without spread operator
      const wavBytes = new Uint8Array(wavHeader.byteLength + byteArray.length);
      wavBytes.set(new Uint8Array(wavHeader), 0);
      wavBytes.set(byteArray, wavHeader.byteLength);

      // Create blob with WAV format
      const audioBlob = new Blob([wavBytes], { type: 'audio/wav' });

      // Create URL from blob
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setOutput("Audio generated successfully!");

    } catch (error) {
      console.error("Error:", error);
      setErrorDetails(error instanceof Error ? error.message : 'An error occurred');
      setOutput("Failed to generate audio response.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URL when component unmounts or when audioUrl changes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col p-6 border max-w-xl w-full gap-6 rounded-md bg-card">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Audio Test Page</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="voice-select" className="font-medium">
              Select Voice
            </label>
            <select
              id="voice-select"
              className="w-full p-2 border rounded-md bg-background"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {Object.entries(VOICE_OPTIONS).map(([category, voices]) => (
                <optgroup key={category} label={category}>
                  {voices.map(voice => (
                    <option key={voice} value={voice}>
                      {voice}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <textarea
            className="w-full p-2 border rounded-md bg-background"
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
          />

          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "Processing..." : "Generate Response"}
          </button>

          {errorDetails && (
            <div className="mt-4 p-4 border border-red-500 rounded-md bg-red-50 text-red-700">
              <h3 className="font-semibold">Error Details:</h3>
              <p>{errorDetails}</p>
            </div>
          )}

          {audioUrl && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Audio Response:</h2>
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {output && (
            <div className="mt-4">
              <div className="p-4 border rounded-md bg-background">
                <pre className="whitespace-pre-wrap">{output}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

    </main>
  );
} 