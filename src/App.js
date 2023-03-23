import { useState } from 'react'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_GPT_API_KEY,
})
const apiClient = new OpenAIApi(configuration)

const LOCALES = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Pусский',
    value: 'ru-RU',
  },
  {
    label: '中文 (简化)',
    value: 'zh-CN',
  },
  {
    label: '中文 (繁體)',
    value: 'zh-TW',
  },
  {
    label: 'Español',
    value: 'es-EM',
  },
  {
    label: 'Türkçe',
    value: 'tr-TR',
  },
  {
    label: 'Português',
    value: 'pt-BR',
  },
]

const App = () => {
  const [inputValue, setInputValue] = useState('')
  const [locale, setLocale] = useState(LOCALES[0].value)
  const [response, setResponse] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (isLoading) {
      return
    }
    setResponse(null)
    setErrorMessage(null)
    setIsLoading(true)
    try {
      const ccy = inputValue || 'any'
      const prompt = `Generate a tweet to share a thought on ${ccy} crypto in random mood with emoji in ${locale}`
      const completions = await apiClient.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 880,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      setResponse(completions.data?.choices?.[0]?.text)
    } catch (error) {
      console.log(error)
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='App'>
      <Container maxWidth='sm'>
        <h1>GPT-3 AI Writer</h1>
        <section>
          <FormControl fullWidth>
            <TextField
              className='input-field'
              placeholder='Enter a crypto you want to tweet about'
              fullWidth
              onChange={(e) => setInputValue(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={locale}
              onChange={(e) => {
                setLocale(e.target.value)
              }}
            >
              {
                LOCALES.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Generate
          </Button>
        </section>
        <section>
          {isLoading && <CircularProgress />}
          {response && !isLoading && (
            <Card>
              <CardContent>
                {response}
              </CardContent>
            </Card>
          )}
          {errorMessage && !isLoading && (
            <div className='error-message'>
              {errorMessage}
            </div>
          )}
        </section>
      </Container>
    </div>
  )
}

export default App
