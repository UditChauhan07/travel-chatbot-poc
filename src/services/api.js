"use client";
const flightResults = [];
console.log(flightResults, "flightResults");
const API_URL = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(API_URL);
//correct code
export const searchFlights = async (searchParams) => {
  try {
    const { origin, destination, ...preferences } = searchParams;
    console.log(searchParams, "searchParams-->");
    console.log(preferences, "api");
    const prompt = `
    You are a flight travel assistant. Provide the 6 best flight options for traveling from ${origin} to ${destination}, based on the following preferences: ${JSON.stringify(
      preferences
    )}.
    
    Your response must be in valid JSON format with this exact structure:
    {
      "suggestions": [
        {
          "airline": "Airline Name",
          "flightNumber": "XX123",
          "departure": "10:00 AM (local time)",
          "arrival": "12:00 PM (local time)",
          "price": "$XXX",
          "class": "economy/business/first",
          "duration": "X hrs Y min",
          "layovers": "Number and locations of layovers (e.g., '1 layover in Dubai')",
           "bookingLink": "https://www.example.com"
        }
      ],
      "summary": "A detailed summary comparing the suggestions, including pricing ranges, flight durations, and layover details."
    }
    
    Ensure the following:
    1. The flight data provided is accurate, up-to-date, and matches the preferences.
    2.The flight options should strictly adhere to the given budget (${
      preferences.budget
    }), class (${preferences.class}), and departure date (${
      preferences.departureDate
    }).
    3. Each booking link must be functional and lead to a valid flight booking page. The link should only go up to the main domain (e.g., ".com") and not include additional paths beyond the main booking page (e.g., "https://www.example.com" is correct, not "https://www.example.com/flight-booking-page").
    4. Include flights that best align with the preferences, such as price range, departure times, or travel class.
    5. For layovers, specify the number and locations, if any.
    6. Provide information about flights departing today (${new Date().toLocaleDateString()}) from ${origin} to ${destination}.
    7. Make sure to provide the most accurate and up-to-date flight information. The data should reflect the latest available flights, not outdated or incorrect information.
    8. Summarize the options clearly, highlighting differences in price, duration, and layovers.
    9. If the budget is restrictive or the preferences are narrow, explain any trade-offs (e.g., longer durations, more layovers) in the summary.

    `;
    console.log("Sending prompt to AI model:", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model?.generateContent(prompt);
    const response = await result?.response;

    if (!response) {
      throw new Error("No response received from the model");
    }

    const text = await response.text();
    console.log("Raw AI response:", text);

    // Sanitize and clean response
    const cleanedText = text
      .replace(/```json/, "") // Remove JSON block identifiers
      .replace(/```/, "") // Remove closing block identifier
      .trim();
    console.log("Cleaned response:", cleanedText);
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
      if (
        !parsedResponse.suggestions ||
        !Array.isArray(parsedResponse.suggestions) ||
        !parsedResponse.summary
      ) {
        throw new Error("Invalid response structure");
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      alert("Error: Unable to parse flight suggestions. Please try again.");
      throw new Error("Invalid AI response structure");
    }

    return parsedResponse;
  } catch (error) {
    console.error("API Error:", error);
    alert("Please try again.");
    window.location.reload();
  }
};
export async function askQuery(query, flightResults) {
  console.log({ flightResults });
  const prompt = `
    Please answer the following query: ${query} 
  `;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model?.generateContent(prompt);
    const response = await result?.response;

    if (!response) {
      throw new Error("No response received from the model");
    }

    const text = await response.text(); // Await text() method correctly

    console.log("Received response from Gemini:", text);

    return text;
  } catch (error) {
    console.error("Error in askQuery:", error);
    throw new Error("Failed to process query");
  }
}
