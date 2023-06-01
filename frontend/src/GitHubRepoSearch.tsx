import { Box, LinearProgress } from '@mui/joy'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import GitHubRepoList, { Repo } from './GitHubRepoList'
import keepPrevious from './keepPrevious'
import { useSearchBox } from './useSearchBox'

const baseApiUrl = new URL('https://demo.erwinv.app')

const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = await res.json()
    throw error
  }

  return res.json()
}

export default function GitHubRepoSearch() {
  const [page, setPage] = useState(1)
  const [searchText, searchBox] = useSearchBox()

  useEffect(() => setPage(1), [searchText])

  const apiUrl = new URL('/api/proxy/github/search/repositories', baseApiUrl)
  apiUrl.searchParams.set('q', searchText)
  apiUrl.searchParams.set('per_page', `${20}`)
  apiUrl.searchParams.set('page', `${page}`)

  const {
    data,
    isLoading,
    // , error, isPrevious
  } = useSWR(apiUrl.href, fetcher, {
    use: [keepPrevious],
    // TODO onErrorRetry based on X-RateLimit-Reset
    errorRetryInterval: 20000,
    errorRetryCount: 3,
  }) as any

  // const total: number = data?.total_count ?? 0
  const repos: Repo[] = data?.items ?? []

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        '> header': {
          mt: 1,
        },
        '> main': {
          height: '100%',
          overflow: 'auto',
        },
      }}
    >
      <header>{searchBox}</header>
      <main>{isLoading ? <LinearProgress /> : <GitHubRepoList repos={repos} />}</main>
      {/* <Snackbar open={!!error} autoHideDuration={60 * 1000}>
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
      </Snackbar> */}
    </Box>
  )
}
