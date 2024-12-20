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

// Define interface for tone options
export interface ToneOption {
    emoji: string;
    name: string;
    transform: (text: string) => string; // Now just returns the prompt string
}

// Tone options with transformations
export const TONE_OPTIONS: ToneOption[] = [
    { 
        emoji: "💬", 
        name: "Neutral",
        transform: (text) => `Say: "${text}"`
    },
    { 
        emoji: "🔮", 
        name: "Mysterious",
        transform: (text) => `Say this like a dramatic wizard speaking very mysteriously: "${text}"`
    },
    { 
        emoji: "😃", 
        name: "Excited",
        transform: (text) => `Say this like a very enthusiastic excited fast-talking friend: "${text.toUpperCase()}!"`
    },
    { 
        emoji: "😮", 
        name: "Surprised",
        transform: (text) => `Say with genuine shock and amazement: "Oh wow! ${text}!?"`
    },
    { 
        emoji: "😔", 
        name: "Sad",
        transform: (text) => `Say in a melancholic and dejected tone: "*sigh* ${text}..."`
    },
    { 
        emoji: "😡", 
        name: "Angry",
        transform: (text) => `Say with intense anger and frustration: "${text.toUpperCase()}!!!"`
    },
    { 
        emoji: "❓", 
        name: "Uncertain",
        transform: (text) => `Say this like a question, even if it's not a question, as if you are very uncertain and confused about what you're saying: "Hmm... ${text}?"`
    },
    { 
        emoji: "🦗", 
        name: "Whispering",
        transform: (text) => `Whisper in a hushed, secretive voice: "${text.toLowerCase()}"`
    },
    { 
        emoji: "🗯️", 
        name: "Yelling",
        transform: (text) => `Shout with maximum volume, with urgency like you are yelling at someone: "${text.toUpperCase()}!!!"`
    },
    { 
        emoji: "🐢", 
        name: "Slow",
        transform: (text) => `Say very slowly and deliberately: "${text.split(' ').join('... ')}..."`
    },
    { 
        emoji: "🐰", 
        name: "Fast",
        transform: (text) => `Say rapidly and energetically: "${text.split(' ').join('-')}"`
    },
    { 
        emoji: "🏄", 
        name: "Surfer",
        transform: (text) => `Say this like a mellow, laid-back surfer, speaking slowly and using surfer slang: "Woah... ${text}, like, totally radical!"`
    },
    { 
        emoji: "🎭", 
        name: "Shakespeare",
        transform: (text) => `Say this like a Shakespearean actor speaking a very dramatic monologue: "${text}"`
    },
    { 
        emoji: "🏴‍☠️", 
        name: "Pirate",
        transform: (text) => `Say this like a pirate: "Arrg, ${text.replace(/r/g, 'rrr')}... arrg"`
    }
]; 