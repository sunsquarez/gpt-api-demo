import { useState } from 'react'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_GPT_API_KEY,
})
const apiClient = new OpenAIApi(configuration)

const App = () => {
  const [inputValue, setInputValue] = useState('')
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
      const prompt = `Generate a tweet to share a thought on ${ccy} crypto in random mood with emoji`
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
      <Container>
        <h1>GPT API Demo</h1>
        <section>
          <TextField
            className='input-field'
            placeholder='Enter a crypto you want to tweet about'
            fullWidth
            onChange={(e) => setInputValue(e.target.value)}
          />
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
