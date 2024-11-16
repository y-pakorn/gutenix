import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DropDown({
  items,
  value,
  setValue,
  selectLabel,
  className,
}: {
  items: {
    value: string
    label: string
  }[]
  value: string
  setValue: (value: string) => void
  selectLabel: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const selectedItem = items.find((it) => it.value === value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("min-w-[200px] justify-between", className)}
        >
          {selectedItem ? (
            <>
              {selectedItem.label}
              {selectedItem.value === "." ? (
                ""
              ) : (
                <span className="font-mono">({selectedItem.value})</span>
              )}
            </>
          ) : (
            selectLabel
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[400px] p-0">
        <Command>
          <CommandInput placeholder={selectLabel} />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {items.map((it) => (
                <CommandItem
                  key={it.value}
                  value={it.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === it.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {it.label}{" "}
                  {it.value === "." ? (
                    ""
                  ) : (
                    <span className="font-mono">({it.value})</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
