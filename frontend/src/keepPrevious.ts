import { useRef, useEffect } from 'react'
import { Middleware } from 'swr'

const keepPrevious: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config)
    const previousDataRef = useRef(swr.data)
    const previousDataPerKeyRef = useRef(new Map([[key, swr.data]]))

    useEffect(() => {
      if (swr.data !== undefined) {
        previousDataRef.current = swr.data
        previousDataPerKeyRef.current.set(key, swr.data)
      }
    }, [swr.data, key])

    const isPrevious = swr.error && previousDataPerKeyRef.current.has(key)

    return {
      ...swr,
      data:
        swr.data ??
        previousDataPerKeyRef.current.get(key) ??
        previousDataRef.current,
      isPrevious,
      isLoading: swr.data === undefined && swr.error === undefined,
    }
  }
}

export default keepPrevious
