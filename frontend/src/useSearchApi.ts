import { useCallback, useEffect, useState } from 'react'
import { Repo } from './GitHubRepoList'

const baseApiUrl = new URL('https://demo.erwinv.app')
const perPage = 20

const apiUrl = new URL('/api/proxy/github/search/repositories', baseApiUrl)
apiUrl.searchParams.set('per_page', `${perPage}`)

export default function useSearchApi(searchText: string) {
  const [page, setPage] = useState(1)
  const [repos, setRepos] = useState<Repo[]>()

  useEffect(() => {
    setRepos(undefined)
    setPage(1)
  }, [searchText])

  useEffect(() => {
    if (!searchText) return

    const aborter = new AbortController()

    ;(async () => {
      apiUrl.searchParams.set('q', searchText)
      apiUrl.searchParams.set('page', `${page}`)

      const res = await fetch(apiUrl, { signal: aborter.signal })

      if (aborter.signal.aborted) return
      if (!res.ok) throw res
      const data = await res.json()
      setRepos((prev) => (!prev ? data.items : [...prev, ...data.items]))
    })().catch((err) => {
      const isAbortError = err instanceof DOMException && err.name === 'AbortError'
      if (!isAbortError) throw err
    })

    return () => {
      aborter.abort()
    }
  }, [page, searchText])

  const loadMore = useCallback(() => {
    setPage((x) => x + 1)
  }, [])

  return { repos, loadMore }
}
