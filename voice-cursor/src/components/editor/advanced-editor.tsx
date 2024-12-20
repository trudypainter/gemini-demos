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
import React, { useEffect, useState } from "react";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { defaultExtensions } from "./extensions";
import { slashCommand, suggestionItems } from "./slash-command";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { uploadFn } from "./image-upload";
import { VoicePopover } from "./selectors/voice-popover";
import { AudioHighlight } from "./extensions/audio-highlight";

const extensions = [...defaultExtensions, slashCommand, AudioHighlight];

interface EditorProp {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}

// Create a context for audio blobs
export const AudioBlobContext = React.createContext<{
  audioBlobs: Map<string, Blob>;
  setAudioBlob: (key: string, blob: Blob) => void;
}>({
  audioBlobs: new Map(),
  setAudioBlob: () => {},
});

const Editor = ({ initialValue, onChange }: EditorProp) => {
  const [showBubbleMenu, setShowBubbleMenu] = useState(false);
  const [audioBlobs, setAudioBlobs] = useState<Map<string, Blob>>(() => {
    // Try to restore audio blobs from storage on initial load
    const storedBlobs = localStorage.getItem('audioBlobs');
    if (storedBlobs) {
      try {
        const parsed = JSON.parse(storedBlobs);
        return new Map(Object.entries(parsed).map(([key, value]) => {
          return [key, new Blob([value as BlobPart], { type: 'audio/wav' })];
        }));
      } catch (e) {
        console.error('Failed to restore audio blobs:', e);
        return new Map();
      }
    }
    return new Map();
  });

  const setAudioBlob = (key: string, blob: Blob) => {
    setAudioBlobs(prev => {
      const newMap = new Map(prev);
      newMap.set(key, blob);
      
      // Store updated blobs in localStorage
      const blobsToStore = Object.fromEntries(newMap);
      localStorage.setItem('audioBlobs', JSON.stringify(blobsToStore));
      
      return newMap;
    });
  };

  // Expose context to window for audio highlight extension
  useEffect(() => {
    (window as any).editorContext = { audioBlobs, setAudioBlob };
    return () => {
      delete (window as any).editorContext;
    };
  }, [audioBlobs]);

  return (
    <AudioBlobContext.Provider value={{ audioBlobs, setAudioBlob }}>
      <EditorRoot>
        <EditorContent
          className=" p-20 rounded-xl w-[800px] bg-white "
          {...(initialValue && { initialContent: initialValue })}
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            // Show bubble menu when text is selected
            const selection = editor.state.selection;
            const hasSelection = !selection.empty;
            setShowBubbleMenu(hasSelection);
            
            onChange(editor.getJSON());
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: "top",
              maxWidth: "none",
              duration: 200,
            }}
            className="w-fit overflow-visible rounded-md border border-muted bg-background shadow-xl transition-all"
          >
            {/* The VoicePopover is the only thing that should be in the bubble menu */}
            <VoicePopover onGenerateComplete={() => setShowBubbleMenu(false)} />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </AudioBlobContext.Provider>
  );
};

export default Editor;
