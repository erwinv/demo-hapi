import { Book } from '@mui/icons-material'
import {
  Avatar,
  Link,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Tooltip,
  Typography,
} from '@mui/joy'
import Emoji from 'react-emoji-render'
import { Repo } from '~/GitHubRepoList'
import { formatCount, formatDateTime } from '~/util'

interface GitHubRepoListItemProps {
  repo: Partial<Repo>
}

export default function GitHubRepoListItem({ repo }: GitHubRepoListItemProps) {
  return (
    <ListItem>
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
  )
}
