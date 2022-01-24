import React from 'react'
import {
  Avatar,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import { Book as BookIcon } from '@mui/icons-material'
import Emoji from 'react-emoji-render'
import { formatDateTime, formatCount } from './util'

export interface Repo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string
  topics: string[]
  stargazers_count: number
  pushed_at: string
}

interface GitHubRepoListProps {
  repos: Partial<Repo>[]
}

const GitHubRepoList: React.FC<GitHubRepoListProps> = ({ repos }) => {
  return (
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
  )
}

export default GitHubRepoList
