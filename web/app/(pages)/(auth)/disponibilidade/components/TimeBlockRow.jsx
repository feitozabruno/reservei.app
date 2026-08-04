"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function TimeField({ value, onChange, error }) {
  return (
    <div className="flex-1 space-y-1">
      <Input type="time" value={value} onChange={onChange} />
      {error && <p className="text-destructive text-sm font-medium">{error}</p>}
    </div>
  );
}

export function TimeBlockRow({ block, onChange, onRemove, error }) {
  const handleChange = (field) => (e) =>
    onChange({ ...block, [field]: e.target.value });

  return (
    <div className="flex items-start gap-2">
      <TimeField
        value={block.start}
        onChange={handleChange("start")}
        error={error?.start}
      />
      <span className="text-muted-foreground pt-2">-</span>
      <TimeField
        value={block.end}
        onChange={handleChange("end")}
        error={error?.end}
      />
      <div className="pt-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
