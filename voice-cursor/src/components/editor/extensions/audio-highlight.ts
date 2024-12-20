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

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Mark } from "@tiptap/pm/model";
import { v4 as uuidv4 } from 'uuid';
import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { AudioMenu } from '../audio-menu';

type MouseLeaveHandler = EventListener;

// Keep track of active play buttons to prevent duplicates
const activePlayButtons = new Set<string>();

// Store audio elements to prevent memory leaks
const audioElements = new Map<string, HTMLAudioElement>();

// Store prompts for each audio highlight
const promptStore = new Map<string, string>();

// Store AudioContext
let audioContext: AudioContext | null = null;

function removeHighlightAndAudio(audioKey: string) {
  // Remove the audio element
  if (audioElements.has(audioKey)) {
    const audio = audioElements.get(audioKey);
    audio?.pause();
    audio?.remove();
    audioElements.delete(audioKey);
  }
  
  // Remove the prompt
  promptStore.delete(audioKey);
}

function renderAudioMenu(
  audioKey: string, 
  position: { top: number; left: number },
  container: HTMLElement,
  highlightId: string,
  onClose: () => void
) {
  const root = createRoot(container);
  const element = React.createElement(AudioMenu, {
    audioKey,
    position,
    prompt: promptStore.get(audioKey) || '',
    onClose: () => {
      root.unmount();
      document.body.removeChild(container);
      activePlayButtons.delete(highlightId);
      onClose();
    }
  });
  root.render(element);
  return root;
}

export const AudioHighlight = Extension.create({
  name: "audioHighlight",

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'audio-highlight-text',
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['highlight'],
        attributes: {
          audioKey: {
            default: null,
            parseHTML: element => element.getAttribute('data-audio-key'),
            renderHTML: attributes => {
              if (!attributes.audioKey) {
                attributes.audioKey = `audio-${uuidv4()}`;
              }
              return {
                'data-audio-key': attributes.audioKey,
              }
            },
          },
          toneEmoji: {
            default: null,
            parseHTML: element => element.getAttribute('data-tone-emoji'),
            renderHTML: attributes => {
              return {
                'data-tone-emoji': attributes.toneEmoji,
              }
            },
          },
          prompt: {
            default: null,
            parseHTML: element => element.getAttribute('data-prompt'),
            renderHTML: attributes => {
              if (attributes.prompt) {
                promptStore.set(attributes.audioKey, attributes.prompt);
              }
              return {
                'data-prompt': attributes.prompt,
              }
            },
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("audio-highlight"),
        
        appendTransaction(transactions, oldState, newState) {
          if (!transactions.some(tr => tr.docChanged)) {
            return null;
          }

          const tr = newState.tr;
          let hasChanges = false;

          const oldHighlights = new Map();
          oldState.doc.descendants((node, pos) => {
            const mark = node.marks.find(m => m.type.name === "highlight");
            if (mark?.attrs.audioKey) {
              oldHighlights.set(mark.attrs.audioKey, {
                text: node.text,
                pos,
                mark
              });
            }
          });

          newState.doc.descendants((node, pos) => {
            const mark = node.marks.find(m => m.type.name === "highlight");
            if (mark?.attrs.audioKey) {
              const oldHighlight = oldHighlights.get(mark.attrs.audioKey);
              if (oldHighlight && oldHighlight.text !== node.text) {
                tr.removeMark(pos, pos + node.nodeSize, mark.type);
                removeHighlightAndAudio(mark.attrs.audioKey);
                hasChanges = true;
              }
              oldHighlights.delete(mark.attrs.audioKey);
            }
          });

          oldHighlights.forEach((highlight, audioKey) => {
            removeHighlightAndAudio(audioKey);
          });

          return hasChanges ? tr : null;
        },

        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];

            doc.descendants((node, pos) => {
              const highlightMark = node.marks.find(mark => mark.type.name === "highlight");
              if (highlightMark) {
                const audioKey = highlightMark.attrs.audioKey;
                decorations.push(
                  Decoration.inline(pos, pos + node.nodeSize, {
                    class: "audio-highlight-text",
                    "data-audio-key": audioKey || "",
                    "data-tone-emoji": highlightMark.attrs.toneEmoji || "",
                  })
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },

        view(editorView) {
          const handleMouseOver = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const highlightEl = target.closest(".audio-highlight-text");
            
            if (highlightEl) {
              const audioKey = highlightEl.getAttribute("data-audio-key");
              
              if (!audioKey) {
                console.warn("No audio key found for highlight element");
                return;
              }
              
              const highlightId = `highlight-${highlightEl.getBoundingClientRect().top}-${highlightEl.getBoundingClientRect().left}`;
              
              if (activePlayButtons.has(highlightId)) {
                return;
              }

              const menuContainer = document.createElement('div');
              document.body.appendChild(menuContainer);
              
              const rect = highlightEl.getBoundingClientRect();
              const position = {
                top: rect.top + window.scrollY - 33,
                left: rect.right + window.scrollX - 80,
              };

              activePlayButtons.add(highlightId);

              const handleMouseLeave: MouseLeaveHandler = (event) => {
                const relatedTarget = (event as MouseEvent).relatedTarget as Node;
                if (!menuContainer.contains(relatedTarget) && 
                    !highlightEl.contains(relatedTarget)) {
                  root.unmount();
                  document.body.removeChild(menuContainer);
                  activePlayButtons.delete(highlightId);
                  highlightEl.removeEventListener('mouseleave', handleMouseLeave);
                  menuContainer.removeEventListener('mouseleave', handleMouseLeave);
                }
              };

              const root = renderAudioMenu(
                audioKey,
                position,
                menuContainer,
                highlightId,
                () => {
                  highlightEl.removeEventListener('mouseleave', handleMouseLeave);
                  menuContainer.removeEventListener('mouseleave', handleMouseLeave);
                }
              );

              highlightEl.addEventListener('mouseleave', handleMouseLeave);
              menuContainer.addEventListener('mouseleave', handleMouseLeave);
            }
          };

          editorView.dom.addEventListener("mouseover", handleMouseOver);

          return {
            destroy: () => {
              editorView.dom.removeEventListener("mouseover", handleMouseOver);
              activePlayButtons.clear();
              audioElements.forEach((audio, key) => {
                audio.pause();
                audio.src = "";
                audioElements.delete(key);
              });
            },
          };
        },
      }),
    ];
  },
}); 