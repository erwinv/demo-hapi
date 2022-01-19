import React, { useRef, useState } from 'react'
import { TextField } from '@mui/material'

export function useSearchBox() {
  const input = useRef<HTMLInputElement>()
  const [searchText, setSearchText] = useState('nodejs')

  const element = (
    <TextField
      inputRef={input}
      fullWidth
      label="Search"
      defaultValue={searchText}
      onKeyPress={(ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault()
          if (input.current) {
            setSearchText(input.current.value)
          }
        }
      }}
    />
  )

  return [searchText, element] as const
}
