import { Box, Container } from '@mui/joy'
import GitHubRepoSearch from './GitHubRepoSearch'

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <GitHubRepoSearch />
      </Box>
    </Container>
  )
}
