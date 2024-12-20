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

import { getVoiceColor } from "@/lib/voice-options";

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "✨ Voice Cursor" }]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "👋 Hello! This is a starter demo using native audio in Gemini 2.0. Just write text below, then highlight it to hear it spoken in different ways." }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "You can hear things read verrrrry mysteriously.",
          marks: [
            {
              type: "highlight",
              attrs: {
                audioKey: "orus-mysterious",
                tone: "mysterious",
                toneEmoji: "🔮",
                color: getVoiceColor("Orus"),
                voice: "Orus",
                prompt: "Say this like a dramatic wizard speaking very mysteriously: \"You can hear things read verrrrry mysteriously.\""
              }
            }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Or whispered, like a secret.",
          marks: [
            {
              type: "highlight",
              attrs: {
                audioKey: "orus-whispered",
                tone: "whispering",
                toneEmoji: "🦗",
                color: getVoiceColor("Orus"),
                voice: "Orus",
                prompt: "Whisper in a hushed, secretive tone: \"or whispered, like a secret.\""
              }
            }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Or spoken in … with lots … and lots … of DRAMA!",
          marks: [
            {
              type: "highlight",
              attrs: {
                audioKey: "orus-dramatic",
                tone: "dramatic",
                toneEmoji: "🎭",
                color: getVoiceColor("Orus"),
                voice: "Orus",
                prompt: "Say this like a Shakespearean actor speaking a very dramatic monologue: \"Or spoken in … with lots … and lots … of DRAMA!\""
              }
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Examples" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "\"Trudy, my friend, I must tell you about some ancient mysteries.\"",
          marks: [
            {
              type: "highlight",
              attrs: {
                audioKey: "charon-mysterious",
                tone: "mysterious",
                toneEmoji: "🔮",
                color: getVoiceColor("Charon"),
                voice: "Charon",
                prompt: "Say this like a dramatic wizard speaking very mysteriously: \"Trudy, my friend, I must tell you about some ancient mysteries.\""
              }
            }
          ]
        },
        { type: "text", text: " Alex said." }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "\"Oh hey Alex, what's going on?\"",
          marks: [
            {
              type: "highlight",
              attrs: {
                audioKey: "kore-neutral",
                tone: "casual",
                toneEmoji: "💬",
                color: getVoiceColor("Kore"),
                voice: "Kore",
                prompt: "Say: \"Oh hey Alex, what's going on?\""
              }
            }
          ]
        },
        { type: "text", text: " Trudy asked." }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "\"Mysterious, mysteries, oh my gosh I love mysteries!!!\"",
          marks: [
            {
              type: "highlight",
              attrs: {
                audioKey: "zephyr-excited",
                tone: "excited",
                toneEmoji: "😃",
                color: getVoiceColor("Zephyr"),
                voice: "Zephyr",
                prompt: "Say this like a very excited person: \"Mysterious, mysteries, oh my gosh I love mysteries!!!\""
              }
            }
          ]
        },
        { type: "text", text: " Jordan exclaimed, running towards the group excitedly." }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "\"Woah.. can everyone, just chill …\"",
          marks: [
            {
              type: "highlight",
              attrs: {
                audioKey: "orus-surfer",
                tone: "surfer",
                toneEmoji: "🏄",
                color: getVoiceColor("Orus"),
                voice: "Orus",
                prompt: "Say this like a chill surfer: \"Woah.. can everyone, just chill …\""
              }
            }
          ]
        },
        { type: "text", text: " said Dan." }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "\"Can you make this quick. I gotta run in like 2 minutes\"",
          marks: [
            {
              type: "highlight",
              attrs: {
                audioKey: "leda-fast",
                tone: "fast",
                toneEmoji: "🐰",
                color: getVoiceColor("Leda"),
                voice: "Leda",
                prompt: "Say this like a fast person: \"Can you make this quick. I gotta run in like 2 minutes\""
              }
            }
          ]
        },
        { type: "text", text: " Suz said." }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Give it a try" }]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Press '/' for commands" }
      ]
    }
  ]
};
