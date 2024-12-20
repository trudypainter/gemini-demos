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

import { X } from 'lucide-react';

interface PromptPopoverProps {
  position: { top: number; left: number };
  prompt: string;
  onClose: () => void;
}

export function PromptPopover({ position, prompt, onClose }: PromptPopoverProps) {
  return (
    <div
      className="absolute bg-zinc-700 text-gray-200 text-sm rounded-[16px]
      
      shadow-lg px-6 py-4 z-50 flex items-center gap-2"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateY(-120%)',
        minWidth: '280px',
      }}
    >
      <div className="flex-1">
        <span className="font-medium"><b>Prompt:</b> {prompt}</span>
      </div>
      <button
        onClick={onClose}
        className="text-gray-200 text-sm transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 