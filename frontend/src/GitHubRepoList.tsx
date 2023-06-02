import { List, ListDivider, listItemDecoratorClasses } from '@mui/joy'
import React, { forwardRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import GitHubRepoListItem from './GitHubRepoListItem'

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
  loadMore: () => void
}

const GitHubRepoList: React.FC<GitHubRepoListProps> = ({ repos, loadMore }) => {
  return (
    <Virtuoso
      style={{ height: '100%' }}
      components={{
        // Header: () => <></>,
        List: forwardRef(({ children, style }, ref) => (
          <List
            component="div"
            style={style}
            sx={{
              '--ListItemDecorator-size': '3.5rem',
              [`.${listItemDecoratorClasses.root}`]: {
                alignSelf: 'start',
              },
            }}
            ref={ref}
          >
            {children}
          </List>
        )),
      }}
      data={repos}
      computeItemKey={(i, repo) => repo.id ?? i}
      itemContent={(i, repo) => (
        <>
          {i === 0 ? null : <ListDivider inset="startContent" />}
          <GitHubRepoListItem repo={repo} />
        </>
      )}
      endReached={loadMore}
    />
  )
}

export default GitHubRepoList
