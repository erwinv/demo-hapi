import React, { useEffect, useState } from 'react'
import {
  Alert,
  AlertTitle,
  Avatar,
  Backdrop,
  Button,
  Box,
  CircularProgress,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Pagination,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Book as BookIcon } from '@mui/icons-material'
import Emoji from 'react-emoji-render'
import useSWR from 'swr'
import { formatDateTime, formatCount } from './util'
import keepPrevious from './keepPrevious'
import { useSearchBox } from './useSearchBox'

interface Repo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string
  topics: string[]
  stargazers_count: number
  language: string
  pushed_at: string
}

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
  const repos: Partial<Repo>[] = data?.items ?? []

  return (
    <Box position="relative">
      {searchBox}
      <List>
        {repos.map((repo, i) => (
          <>
            {i > 0 && <Divider variant="inset" component="li" />}
            <ListItem key={repo.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={repo.name}>
                  <BookIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    href={repo.html_url}
                    underline="hover"
                    target="_blank"
                    rel="noopener"
                  >
                    {repo.full_name}
                  </Link>
                }
                secondary={
                  <>
                    <Typography>
                      <Emoji text={repo.description ?? ''} />
                    </Typography>
                    <Typography variant="caption">
                      ☆ {formatCount(repo?.stargazers_count ?? 0)} Updated{' '}
                      <Tooltip
                        title={formatDateTime(repo?.pushed_at ?? '', 'full')}
                      >
                        <span>{formatDateTime(repo?.pushed_at ?? '')}</span>
                      </Tooltip>
                    </Typography>
                  </>
                }
              />
            </ListItem>
          </>
        ))}
      </List>
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
