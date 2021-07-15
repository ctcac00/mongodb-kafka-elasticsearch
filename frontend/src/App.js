import React from 'react';
import { ThemeProvider } from "@material-ui/styles";
import {
  createMuiTheme,
  CssBaseline
} from "@material-ui/core";
import {
  Container,
  Typography,
  Box
} from "@material-ui/core";

import './App.css';
import Searches from './components/Searches';

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const App = () => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container fixed>
        <Box my={4}>
            <Typography variant="h4" component="h1" align="center">
            Book Search
            </Typography>
        </Box>
        <Searches />
    </Container>
    </ThemeProvider>
);

export default App;
