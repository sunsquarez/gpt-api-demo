import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import App from './App'
import './index.css'

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#01a781',
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
)
