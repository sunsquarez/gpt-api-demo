import { useState } from 'react'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Configuration, OpenAIApi } from 'openai'

import { REACTIONS, LOCALES } from './constants'

const configuration = new Configuration({ apiKey: process.env.REACT_APP_GPT_API_KEY })
const apiClient = new OpenAIApi(configuration)

const App = () => {
  const [payload, setPayload] = useState({
    crypto: '',
    reaction: REACTIONS[0].value,
    locale: LOCALES[0].value,
  })
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
      const {
        crypto = 'any',
        reaction,
        locale,
      } = payload
      const prompt = `Generate a tweet to share a thought on ${crypto} crypto in ${reaction} reaction with emoji in ${locale}`
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
          <FormControl>
            <TextField
              className='input-field'
              placeholder='Enter a crypto you want to tweet about'
              fullWidth
              onChange={(e) => setPayload({ ...payload, crypto: e.target.value})}
            />
            <Select
              value={payload.reaction}
              onChange={(e) => setPayload({ ...payload, reaction: e.target.value})}
            >
              {
                REACTIONS.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={payload.locale}
              onChange={(e) => setPayload({ ...payload, locale: e.target.value})}
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
