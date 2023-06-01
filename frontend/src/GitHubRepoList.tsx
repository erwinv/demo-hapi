import { Book } from '@mui/icons-material'
import {
  Avatar,
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Tooltip,
  Typography,
  listItemDecoratorClasses,
} from '@mui/joy'
import React from 'react'
import Emoji from 'react-emoji-render'
import { formatCount, formatDateTime } from './util'

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
    <List
      sx={{
        '--ListItemDecorator-size': '3.5rem',
        [`.${listItemDecoratorClasses.root}`]: {
          alignSelf: 'start',
        },
      }}
    >
      {repos.map((repo, i) => (
        <>
          {i > 0 && <ListDivider inset="startContent" />}
          <ListItem key={repo.id}>
            <ListItemButton>
              <ListItemDecorator>
                <Avatar alt={repo.name}>
                  <Book />
                </Avatar>
              </ListItemDecorator>
              <ListItemContent>
                <Typography>
                  <Link overlay href={repo.html_url} target="_blank">
                    {repo.full_name}
                  </Link>
                </Typography>

                <Typography level="body2">
                  <Emoji text={repo.description ?? ''} />
                </Typography>

                <Typography level="body3">
                  ☆ {formatCount(repo?.stargazers_count ?? 0)} Updated{' '}
                  <Tooltip title={formatDateTime(repo?.pushed_at ?? '', 'full')}>
                    <Typography>{formatDateTime(repo?.pushed_at ?? '')}</Typography>
                  </Tooltip>
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </>
      ))}
    </List>
  )
}

export default GitHubRepoList
