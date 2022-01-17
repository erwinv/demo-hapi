import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Avatar,
  Backdrop,
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
  TextField,
  Typography,
} from '@mui/material'
import { Book as BookIcon } from '@mui/icons-material'
import Emoji from 'react-emoji-render'
import { formatDateTime, formatCount } from './util'

interface Repo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string
  topics: string[]
  stargazers_count: number
  language: string
  updated_at: string
}

export default function GitHubRepoSearch() {
  const [searchText, setSearchText] = useState('nodejs')
  const [searchTrigger, setSearchTrigger] = useState(false)
  const [page, setPage] = useState(1)
  const pageRef = useRef(page)
  const [total, setTotal] = useState(0)
  const [repos, setRepos] = useState<Partial<Repo>[]>([])
  const [loading, setLoading] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      setLoading(true)
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          searchText
        )}&per_page=10&page=${page}`,
        { signal: controller.signal }
      ).finally(() => setLoading(false))

      if (response.status === 403) {
        setRateLimited(true)
      } else if (response.status === 200) {
        pageRef.current = page
        const data = await response.json()
        setTotal(data.total_count)
        setRepos(data.items)
      }
    })()

    return () => {
      controller.abort()
    }
  }, [page, searchTrigger])

  return (
    <Box position="relative">
      <TextField
        fullWidth
        label="Search"
        value={searchText}
        onChange={(ev) => setSearchText(ev.target.value)}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            ev.preventDefault()
            if (page !== 1) setPage(1)
            else setSearchTrigger(!searchTrigger)
          }
        }}
      />
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
                      {formatDateTime(repo?.updated_at ?? '')}
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
        page={pageRef.current}
        onChange={(_, page) => setPage(page)}
      />
      <Backdrop open={loading} sx={{ position: 'absolute' }}>
        <CircularProgress size={80} />
      </Backdrop>
      <Snackbar
        open={rateLimited}
        autoHideDuration={60 * 1000}
        onClose={() => setRateLimited(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert severity="warning">
          GitHub API rate limit exceeded! Please try again after 1 minute.
        </Alert>
      </Snackbar>
    </Box>
  )
}
