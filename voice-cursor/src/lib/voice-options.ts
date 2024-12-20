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

// Voice options with associated colors
export const VOICE_OPTIONS = [
    { name: "Zephyr", color: "rgba(37, 99, 235, 0.2)" },     // Blue
    { name: "Puck", color: "rgba(147, 51, 234, 0.2)" },      // Purple
    { name: "Charon", color: "rgba(224, 0, 0, 0.2)" },       // Red
    { name: "Kore", color: "rgba(234, 179, 8, 0.2)" },       // Yellow
    { name: "Fenrir", color: "rgba(0, 138, 0, 0.2)" },       // Green
    { name: "Leda", color: "rgba(255, 165, 0, 0.2)" },       // Orange
    { name: "Orus", color: "rgba(186, 64, 129, 0.2)" },      // Pink
    { name: "Gemini H", color: "rgba(168, 162, 158, 0.2)" }, // Gray
];

export const getVoiceColor = (voiceName: string): string => {
    const voice = VOICE_OPTIONS.find(v => v.name === voiceName);
    if (!voice) {
        console.warn(`Voice color not found for "${voiceName}", using default color`);
        return "rgba(168, 162, 158, 0.2)"; // Default gray color
    }
    return voice.color;
}; 