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

import { useEffect, useRef, useState } from 'react';
import { Play, Download, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PromptPopover } from './prompt-popover';

interface AudioMenuProps {
  audioKey: string;
  position: { top: number; left: number };
  prompt: string;
  onClose: () => void;
}

export function AudioMenu({ audioKey, position, prompt, onClose }: AudioMenuProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isPersistent, setIsPersistent] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && 
          !menuRef.current.contains(event.target as Node) && 
          !promptRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!isPersistent) return;

    function handleClickOutside(event: MouseEvent) {
      if (promptRef.current && 
          !promptRef.current.contains(event.target as Node) &&
          !menuRef.current?.contains(event.target as Node)) {
        setShowPrompt(false);
        setIsPersistent(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPersistent]);

  const handlePlay = async () => {
    const audioBlob = (window as any).editorContext?.audioBlobs?.get(audioKey);
    if (!audioBlob) {
      console.error("❌ No audio found for key:", audioKey);
      return;
    }

    try {
      setIsLoading(true);
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio();

      audio.oncanplaythrough = () => {
        setIsLoading(false);
        audio.play().catch(error => {
          console.error("Play error:", error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

      audio.onerror = (e) => {
        console.error("❌ Audio error:", e);
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(url);
      };

      audio.src = url;
      audio.load();

    } catch (error) {
      console.error("❌ Error setting up audio:", error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const audioBlob = (window as any).editorContext?.audioBlobs?.get(audioKey);
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audio-${audioKey}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleInfoMouseEnter = () => {
    if (!isPersistent) {
      setShowPrompt(true);
    }
  };

  const handleInfoMouseLeave = () => {
    if (!isPersistent) {
      setShowPrompt(false);
    }
  };

  const handleInfoClick = () => {
    setShowPrompt(true);
    setIsPersistent(true);
  };

  const handlePromptClose = () => {
    setShowPrompt(false);
    setIsPersistent(false);
  };

  return (
    <>
      <div
        ref={menuRef}
        className="absolute bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 z-50"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="flex items-center gap-1 relative">
          <button
            onClick={handlePlay}
            className="relative p-1 rounded hover:bg-gray-100 transition-colors mr-3"
            disabled={isLoading}
          >
            {isPlaying ? (
              <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>
          
          <div className="absolute top-0.5 left-7 h-9 border-l border-gray-200 -translate-y-2 bg-gray-200 mx-0.5">
          </div>
          
          <button
            onClick={handleDownload}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
          </button>
          
          <button
            onClick={handleInfoClick}
            onMouseEnter={handleInfoMouseEnter}
            onMouseLeave={handleInfoMouseLeave}
            className={cn(
              "p-1 rounded transition-colors",
              isPersistent ? "bg-gray-100" : "hover:bg-gray-100"
            )}
          >
            <Image 
              src="/info_spark.svg"
              alt="Info"
              width={16}
              height={16}
              className="text-gray-500"
            />
          </button>
        </div>
      </div>
      
      {showPrompt && (
        <div ref={promptRef}>
          <PromptPopover
            position={{
              top: position.top + 10,
              left: position.left - 20,
            }}
            prompt={prompt || "No prompt available"}
            onClose={handlePromptClose}
          />
        </div>
      )}
    </>
  );
} 