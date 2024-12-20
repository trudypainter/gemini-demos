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

import { Button } from "@/components/ui/button";
import { useState, useContext, useEffect } from "react";
import { Mic, Loader2, AlertCircle, Info } from "lucide-react";
import { useEditor } from "novel";
import { AudioBlobContext } from "../advanced-editor";
import { v4 as uuidv4 } from 'uuid';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TONE_OPTIONS, type ToneOption } from "@/lib/tone-options";
import { VOICE_OPTIONS, getVoiceColor } from "@/lib/voice-options";

interface VoicePopoverProps {
    onGenerateComplete?: () => void;
}

// Define an interface for the mime parameters
interface MimeParams {
    [key: string]: string | undefined;  // Allow undefined values
    mimeBase?: string;
    rate?: string;
}

export const VoicePopover = ({ onGenerateComplete }: VoicePopoverProps) => {
    const { editor } = useEditor();
    const { setAudioBlob } = useContext(AudioBlobContext);
    const [selectedVoice, setSelectedVoice] = useState<string>("Zephyr");
    const [selectedTone, setSelectedTone] = useState<string>("Neutral");
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>("");

    // Add effect to clear error message after 5 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    // Update the prompt whenever selection, voice, or tone changes
    useEffect(() => {
        if (editor) {
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to);
            if (selectedText) {
                const selectedToneOption = TONE_OPTIONS.find(t => t.name === selectedTone);
                if (selectedToneOption?.transform) {
                    setPrompt(selectedToneOption.transform(selectedText));
                }
            }
        }
    }, [selectedTone, editor?.state.selection.from, editor?.state.selection.to, editor]);

    const generateAudio = async (text: string, voice: string, tone: string) => {
        try {
            console.log("Generating audio for:", { text, voice, tone });
            const textToSpeak = prompt;
            console.log("-----Text to speak:", textToSpeak);

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/
                models/gemini-2.0-flash-exp:generateContent?key=
                ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: textToSpeak }]
                        }],
                        generationConfig: {
                            response_modalities: ["AUDIO"],
                            speech_config: {
                                voice_config: {
                                    prebuilt_voice_config: {
                                        voice_name: voice
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
                console.error("No audio data in response:", data);
                throw new Error('No audio data received in response');
            }

            const base64Audio = data.candidates[0].content.parts[0].inlineData.data;
            const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType || 'audio/wav';
            console.log("Received audio data:", { mimeType, dataLength: base64Audio.length });

            // Create WAV file from base64 data
            const byteCharacters = atob(base64Audio);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Parse the audio format parameters
            const mimeParams = mimeType.split(';').reduce((acc: MimeParams, param: string) => {
                const [key, value] = param.split('=');
                if (value) {
                    acc[key.trim()] = value.trim();
                } else {
                    acc.mimeBase = key.trim();
                }
                return acc;
            }, {} as MimeParams);

            // Create WAV header
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
            view.setUint32(24, Number.parseInt(mimeParams.rate) || 24000, true); // sample rate
            view.setUint32(28, (Number.parseInt(mimeParams.rate) || 24000) * 2, true); // byte rate
            view.setUint16(32, 2, true); // block align
            view.setUint16(34, 16, true); // bits per sample

            // "data" sub-chunk
            view.setUint32(36, 0x64617461, false); // "data"
            view.setUint32(40, byteArray.length, true); // data length

            // Combine header and PCM data
            const wavBytes = new Uint8Array(wavHeader.byteLength + byteArray.length);
            wavBytes.set(new Uint8Array(wavHeader), 0);
            wavBytes.set(byteArray, wavHeader.byteLength);

            // Create blob with WAV format
            const audioBlob = new Blob([wavBytes], { type: 'audio/wav' });
            console.log("Created audio blob:", audioBlob);

            return audioBlob;
        } catch (error) {
            console.error("Error generating audio:", error);
            throw error;
        }
    };

    const handleGenerate = async () => {
        if (!selectedVoice || !selectedTone || !editor) return;

        setIsGenerating(true);
        setErrorMessage(null); // Clear any previous errors
        try {
            // Get the selected text
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to);

            if (!selectedText) {
                setErrorMessage("Please select some text first");
                return;
            }

            console.log("Starting generation for:", { selectedText, selectedVoice, selectedTone });

            // Get the color for the selected voice
            const voiceColor = getVoiceColor(selectedVoice);

            // Generate audio
            const audioBlob = await generateAudio(selectedText, selectedVoice, selectedTone);

            // Generate a unique ID instead of using position
            const audioKey = `audio-${uuidv4()}`;
            setAudioBlob(audioKey, audioBlob);
            console.log("Stored audio blob with key:", audioKey);

            // Store the prompt
            (window as any).editorContext.promptStore = (window as any).editorContext.promptStore || new Map();
            (window as any).editorContext.promptStore.set(audioKey, prompt);
            console.log("Stored prompt with key:", audioKey);

            // Remove any existing highlights in the selection
            editor.chain()
                .focus()
                .unsetHighlight()
                .setTextSelection({ from, to })
                .run();

            // Add the new highlight with the voice's color and store the audio key as a data attribute
            editor.chain()
                .focus()
                .setTextSelection({ from, to })
                .setMark('highlight', {
                    color: voiceColor,
                    audioKey,
                    tone: selectedTone,
                    toneEmoji: TONE_OPTIONS.find(t => t.name === selectedTone)?.emoji || '',
                    prompt: prompt
                })
                .run();

            console.log("Applied highlight with color, audioKey, and prompt:", { voiceColor, audioKey, prompt });

            // Reset selection and close the popover
            editor.commands.setTextSelection(to);
            onGenerateComplete?.();
        } catch (error) {
            console.error("Error in handleGenerate:", error);
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred while generating audio');
            // Don't call onGenerateComplete here to keep the popover open
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-[450px]">
            <div className="flex gap-2">
                {/* Voice Column */}
                <div className="w-1/3 border-r border-muted p-4">
                    <div className="mb-4 text-[8px] font-semibold text-muted-foreground">
                        VOICE
                    </div>
                    <div className="flex flex-col gap-1">
                        {VOICE_OPTIONS.map((voice) => (
                            <Button
                                key={voice.name}
                                variant="ghost"
                                className={`justify-start px-2 h-8 text-xs ${selectedVoice === voice.name ? 'bg-blue-100 border border-blue-200' : 'border border-transparent'}`}
                                onClick={() => {
                                    setSelectedVoice(voice.name);
                                    console.log("Selected voice:", voice.name);
                                }}
                            >
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: voice.color }}
                                />
                                {voice.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Tone Column */}
                <div className="w-2/3 p-4">
                    <div className="mb-4 text-[8px] font-semibold text-muted-foreground">
                        TONE
                    </div>
                    <div className="flex flex-col gap-1 h-full justify-between ">
                        <div className="grid grid-cols-4 gap-1 gap-y-3 ">
                            {TONE_OPTIONS.map((tone) => (
                                <Button
                                    key={tone.name}
                                    variant="ghost"
                                    className={`flex flex-col items-center justify-center h-16 
                                    ${selectedTone === tone.name ? 'bg-blue-100 border border-blue-200' : 'border border-transparent'}`}
                                    onClick={() => {
                                        setSelectedTone(tone.name);
                                        console.log("Selected tone:", tone.name);
                                    }}
                                >
                                    <span className="text-3xl">{tone.emoji}</span>
                                    <span className="text-[9px]">{tone.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-muted">
                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-2 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <AlertCircle className="h-4 w-4" />
                        {errorMessage}
                    </div>
                )}

                {/* Prompt Display Section */}
                <div className="mb-4">
                    <div className="flex border rounded-lg bg-gray-50 focus-within:ring-2 py-1
                      focus-within:border-gray-400 focus-within:ring-transparent">
                        <div className="flex items-start pl-2 pt-2">
                            <img src="/pen_spark.svg" alt="Edit" className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={2}
                            className="w-full tracking-tight font-mono text-xs text-gray-500 focus:text-gray-700 px-1.5 py-2.5 border-none bg-transparent resize-none focus:outline-none"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgb(203 213 225) transparent'
                            }}
                        />
                    </div>
                </div>

                {/* Generate Button */}
                <Button
                    className="w-full mb-0 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600"
                    disabled={isGenerating}
                    onClick={handleGenerate}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Mic className="mr-2 h-4 w-4" />
                            Generate Voice
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}; 