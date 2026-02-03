import React, { useMemo, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './select'

type Option = { label: string; value: string }

type Props = {
  options: Option[]
  mapOption?: { label: string; value: string }
  onChange?: (value: string) => void
  placeholder?: string
}

export default function SearchableSelect({
  options,
  mapOption,
  onChange,
  placeholder = 'Select...',
}: Props) {
  const [query, setQuery] = useState('')

  const normalized = useMemo(() => {
    if (!mapOption) return options
    return options.map((o: any) => ({ label: o[mapOption.label], value: o[mapOption.value] }))
  }, [options, mapOption])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return normalized
    return normalized.filter((o) => o.label.toLowerCase().includes(q))
  }, [normalized, query])

  return (
    <div className="w-full">
      <input
        aria-label="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="mb-2 w-full rounded border px-2 py-1"
      />

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue>{placeholder}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filtered.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
