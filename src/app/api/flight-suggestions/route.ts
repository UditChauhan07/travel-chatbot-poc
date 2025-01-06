import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: Request) {
  try {
    const { origin, destination, preferences } = await req.json()

    console.log('Received request:', { origin, destination, preferences })

    const prompt = `Act as a flight travel assistant. Suggest 3 best flight options from ${origin} to ${destination} based on these preferences: ${JSON.stringify(preferences)}. 
    Provide exactly 3 suggestions in valid JSON format with this structure:
    {
      "suggestions": [
        {
          "airline": "Airline Name",
          "flightNumber": "XX123",
          "departure": "10:00 AM",
          "arrival": "12:00 PM",
          "price": "$XXX",
          "class": "economy/business/first",
          "duration": "X hrs Y min"
        }
      ],
      "summary": "A brief summary of the suggestions"
    }`

    console.log('Sending prompt to Gemini:', prompt)

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Received response from Gemini:', text)

    // Parse and validate the response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(text)
      // Ensure the response has the required structure
      if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions) || !parsedResponse.summary) {
        throw new Error('Invalid response structure')
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e)
      throw new Error('Failed to parse AI response')
    }

    return Response.json(parsedResponse)
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { 
        error: 'Failed to get suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
