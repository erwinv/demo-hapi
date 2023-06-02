import { Box, LinearProgress } from '@mui/joy'
import GitHubRepoList from './GitHubRepoList'
import useSearchApi from './useSearchApi'
import { useSearchBox } from './useSearchBox'

export default function GitHubRepoSearch() {
  const [searchText, searchBox] = useSearchBox()
  const { repos, loadMore } = useSearchApi(searchText)

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
      <main>
        {!repos ? <LinearProgress /> : <GitHubRepoList repos={repos} loadMore={loadMore} />}
      </main>
    </Box>
  )
}
