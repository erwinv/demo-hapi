import React, { useEffect, useState } from 'react'
import {
  Alert,
  AlertTitle,
  Backdrop,
  Button,
  Box,
  CircularProgress,
  Pagination,
  Snackbar,
} from '@mui/material'
import useSWR from 'swr'
import keepPrevious from './keepPrevious'
import { useSearchBox } from './useSearchBox'
import GitHubRepoList, { Repo } from './GitHubRepoList'

export default function GitHubRepoSearch() {
  const [page, setPage] = useState(1)
  const [searchText, searchBox] = useSearchBox()

  useEffect(() => setPage(1), [searchText])

  const apiUrl = `/api/proxy/github/search/repositories?q=${encodeURIComponent(
    searchText
  )}&per_page=10&page=${page}`

  const fetcher = async (url: string) => {
    const res = await fetch(url)

    if (!res.ok) {
      const error = await res.json()
      throw error
    }

    return res.json()
  }

  const { data, error, isLoading, isPrevious } = useSWR(apiUrl, fetcher, {
    use: [keepPrevious],
    // TODO onErrorRetry based on X-RateLimit-Reset
    errorRetryInterval: 20000,
    errorRetryCount: 3,
  }) as any

  const total: number = data?.total_count ?? 0
  const repos: Repo[] = data?.items ?? []

  return (
    <Box position="relative">
      {searchBox}
      <GitHubRepoList repos={repos} />
      <Pagination
        sx={{ display: 'flex', justifyContent: 'center' }}
        size="large"
        count={Math.ceil(Math.min(total, 1000) / 10)}
        page={page}
        onChange={(_, page) => setPage(page)}
        disabled={error && !isPrevious}
      />
      <Backdrop open={isLoading} sx={{ position: 'absolute' }}>
        <CircularProgress size={80} />
      </Backdrop>
      <Snackbar open={!!error} autoHideDuration={60 * 1000}>
        <Alert
          severity="warning"
          action={
            <Button
              href={error?.documentation_url}
              target="_blank"
              rel="noopener"
            >
              Docs
            </Button>
          }
        >
          {isPrevious && <AlertTitle>Showing Stale Data</AlertTitle>}
          {error?.message.replace(/\(.*\)/, '')}
        </Alert>
      </Snackbar>
    </Box>
  )
}
