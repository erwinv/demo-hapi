import { Input } from '@mui/joy'
import { useRef, useState } from 'react'

export function useSearchBox() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchText, setSearchText] = useState('nodejs')

  const element = (
    <Input
      slotProps={{
        input: { ref: inputRef },
      }}
      placeholder="Search"
      defaultValue={searchText}
      onKeyPress={(ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
          if (inputRef.current) {
            setSearchText(inputRef.current.value)
          }
        }
      }}
    />
  )

  return [searchText, element] as const
}
