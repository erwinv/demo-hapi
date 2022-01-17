import React from 'react'
import { Box, Container } from '@mui/material'
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
