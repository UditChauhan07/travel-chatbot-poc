"use client";
import axios from "axios";
const flightResults = [];
console.log(flightResults, "flightResults");
// const API_URL = process.env.GOOGLE_API_KEY;
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyDq2-btqeZjPF8kDtE_qfDnfxYYlu3D4e4");
//correct code
// export const searchFlights = async (searchParams) => {
//   try {
//     const { origin, destination, preferences } = searchParams;
//     const prompt = `Act as a flight travel assistant. Suggest 6 best flight options from ${origin} to ${destination} based on these preferences: ${JSON.stringify(
//       preferences
//     )}.
//     Provide exactly 6 suggestions in valid JSON format with this structure:
//     {
//       "suggestions": [
//        {
//   "airline": "Airline Name",
//   "flightNumber": "XX123",
//   "departure": "10:00 AM",
//   "arrival": "12:00 PM",
//   "price": "$XXX",
//   "class": "economy/business/first",
//   "duration": "X hrs Y min",
//   "bookingLink": "URL for booking the flight",
// }

//       ],
//       "summary": "Provide a detailed summary of the suggestions, including a comparison of prices, durations, and layovers."
//     }`;
//     console.log("Sending prompt to Gemini:", prompt);
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model?.generateContent(prompt);
//     const response = await result?.response;
//     if (!response) {
//       throw new Error("No response received from the model");
//     }
//     const text = await response.text();
//     console.log("Received response from Gemini:", text);
//     // Strip Markdown formatting
//     const cleanedText = text
//       .replace(/```json/, "") // Remove opening backticks with `json`
//       .replace(/```/, "") // Remove closing backticks
//       .trim(); // Trim any extra whitespace
//     console.log("Cleaned response:", cleanedText);
//     // Parse and validate the cleaned response
//     let parsedResponse;
//     try {
//       parsedResponse = JSON.parse(cleanedText);

//       if (
//         !parsedResponse.suggestions ||
//         !Array.isArray(parsedResponse.suggestions) ||
//         !parsedResponse.summary
//       ) {
//         throw new Error("Invalid response structure");
//       }
//     } catch (e) {
//       console.error("Failed to parse AI response:", e);
//       throw new Error("Failed to parse AI response");
//     }
//     if (parsedResponse) {
//       // Push the data to the array
//       flightResults.push(...parsedResponse.suggestions); // Spread to add all suggestions
//       console.log("Flight suggestions added to array:", flightResults);
//     }
//     return parsedResponse;
//   } catch (error) {
//     console.error("API Error:", error);
//     return new Response(
//       JSON.stringify({
//         error: "Failed to get suggestions",
//         details: error instanceof Error ? error.message : "Unknown error",
//       }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// };
export const searchFlights = async (searchParams) => {
  try {
    const { origin, destination, preferences } = searchParams;
    // const prompt = `Act as a flight travel assistant. Suggest 6 best flight options from ${origin} to ${destination} based on these preferences: ${JSON.stringify(
    //   preferences
    // )}.
    // Provide exactly 6 suggestions in valid JSON format with this structure:
    // {
    //   "suggestions": [
    //    {
    //      "airline": "Airline Name",
    //      "flightNumber": "XX123",
    //      "departure": "10:00 AM",
    //      "arrival": "12:00 PM",
    //      "price": "$XXX",
    //      "class": "economy/business/first",
    //      "duration": "X hrs Y min",
    //      "bookingLink": "URL for booking the flight"
    //    }
    //   ],
    //   "summary": "Provide a detailed summary of the suggestions, including a comparison of prices, durations, and layovers."
    // }`;

    // const prompt = `
    // You are a flight travel assistant. Provide the 6 best flight options for traveling from ${origin} to ${destination}, based on the following preferences: ${JSON.stringify(
    //   preferences
    // )}.
    
    // Your response must be in valid JSON format with this exact structure:
    // {
    //   "suggestions": [
    //     {
    //       "airline": "Airline Name",
    //       "flightNumber": "XX123",
    //       "departure": "10:00 AM (local time)",
    //       "arrival": "12:00 PM (local time)",
    //       "price": "$XXX",
    //       "class": "economy/business/first",
    //       "duration": "X hrs Y min",
    //       "layovers": "Number and locations of layovers (e.g., '1 layover in Dubai')",
    //       "bookingLink": "A working URL for booking this flight"
    //     }
    //   ],
    //   "summary": "A detailed summary comparing the suggestions, including pricing ranges, flight durations, and layover details."
    // }
    
    // Ensure the following:
    // 1. The flight data provided is accurate and matches the preferences.
    // 2. Each booking link must be functional and lead to a valid flight booking page.
    // 3. Include flights that best align with the preferences, such as price range, departure times, or travel class.
    // 4. For layovers, specify the number and locations, if any.
    // 5. Provide information about flights departing today (${new Date().toLocaleDateString()}) from ${origin} to ${destination}.
    // 6. Summarize the options clearly, highlighting differences in price, duration, and layovers.
    // `;
    const prompt = `
    You are a flight travel assistant. Provide the 6 best flight options for traveling from ${origin} to ${destination}, based on the following preferences: ${JSON.stringify(preferences)}.
    
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
          "bookingLink": "A working URL for booking this flight"
        }
      ],
      "summary": "A detailed summary comparing the suggestions, including pricing ranges, flight durations, and layover details."
    }
    
    Ensure the following:
    1. The flight data provided is accurate, up-to-date, and matches the preferences.
    2. Each booking link must be functional and lead to a valid flight booking page.
    3. Include flights that best align with the preferences, such as price range, departure times, or travel class.
    4. For layovers, specify the number and locations, if any.
    5. Provide information about flights departing today (${new Date().toLocaleDateString()}) from ${origin} to ${destination}.
    6. Make sure to provide the most accurate and up-to-date flight information. The data should reflect the latest available flights, not outdated or incorrect information.
    7. Summarize the options clearly, highlighting differences in price, duration, and layovers.
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

  // Ensure flightResults is an array
  const flightArray = Array.isArray(flightResults)
    ? flightResults
    : flightResults?.suggestions || [];

  const formattedResults = flightArray
    .map(
      (flight, index) => `
    Flight ${index + 1}:
    Airline: ${flight.airline}
    Flight Number: ${flight.flightNumber}
    Departure: ${flight.departure}
    Arrival: ${flight.arrival}
    Price: ${flight.price}
    Class: ${flight.class}
    Duration: ${flight.duration}
  `
    )
    .join("\n");

  // const prompt = `
  //   Given the following flight search results:

  //   ${formattedResults}

  //   Please answer the following query: ${query}

  //   Provide a concise and relevant answer based on the flight information provided.
  // `;
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
