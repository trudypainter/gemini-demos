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

import { Check, Highlighter } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

const HIGHLIGHT_COLORS = [
  {
    name: "Default",
    color: "#ffffff",
  },
  {
    name: "Purple",
    color: "rgba(147, 51, 234, 0.2)",
  },
  {
    name: "Red",
    color: "rgba(224, 0, 0, 0.2)",
  },
  {
    name: "Yellow",
    color: "rgba(234, 179, 8, 0.2)",
  },
  {
    name: "Blue",
    color: "rgba(37, 99, 235, 0.2)",
  },
  {
    name: "Green",
    color: "rgba(0, 138, 0, 0.2)",
  },
  {
    name: "Orange",
    color: "rgba(255, 165, 0, 0.2)",
  },
  {
    name: "Pink",
    color: "rgba(186, 64, 129, 0.2)",
  },
  {
    name: "Gray",
    color: "rgba(168, 162, 158, 0.2)",
  },
];

interface HighlightSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HighlightSelector = ({ open, onOpenChange }: HighlightSelectorProps) => {
  const { editor } = useEditor();
  if (!editor) return null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <EditorBubbleItem
          onSelect={() => {
            onOpenChange(true);
          }}
        >
          <Button size="sm" className="rounded-none" variant="ghost">
            <Highlighter
              className={cn("h-4 w-4", {
                "text-blue-500": editor.isActive("highlight"),
              })}
            />
          </Button>
        </EditorBubbleItem>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        className="w-48 p-1"
        sideOffset={5}
      >
        <div className="flex flex-col">
          <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
            Highlight Color
          </div>
          {HIGHLIGHT_COLORS.map((item) => (
            <EditorBubbleItem
              key={item.name}
              onSelect={() => {
                if (item.name === "Default") {
                  editor.chain().focus().unsetHighlight().run();
                } else {
                  editor.chain().focus().toggleHighlight({ color: item.color }).run();
                }
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-sm border px-2 py-px font-medium"
                  style={{ backgroundColor: item.color }}
                >
                  A
                </div>
                <span>{item.name}</span>
              </div>
              {editor.isActive("highlight", { color: item.color }) && (
                <Check className="h-4 w-4" />
              )}
            </EditorBubbleItem>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 