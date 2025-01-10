"use client";
const API_URL = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(API_URL);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const flightResults1 = {};
console.log(
  flightResults1,
  "flightResults1flightResults1flightResults1flightResults1"
);
//correct code
export const searchFlights = async (searchParams) => {
  try {
    const { origin, destination, ...preferences } = searchParams;

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
  2. The flight options should strictly adhere to the given budget (${
    preferences.budget
  }), class (${preferences.class}), and departure date (${
      preferences.departureDate
    }).
  3. Each booking link must be functional and lead to a valid flight booking page. The link should only go up to the main domain (e.g., ".com") and not include additional paths beyond the main booking page (e.g., "https://www.goindigo.in/book/flight-select.html" is correct, not "https://www.example.com/flight-booking-page").
  4. Include flights that best align with the preferences, such as price range, departure times, or travel class.
  5. For layovers, specify the number and locations, if any.
  6. Provide information about flights departing today (${new Date().toLocaleDateString()}) from ${origin} to ${destination}.
  7. Provide the most accurate and up-to-date flight information, including the latest available departure time and date.
  8. Make sure the data reflects the latest available flights, not outdated or incorrect information.
  9. Summarize the options clearly, highlighting differences in price, duration, and layovers.
  10. If the budget is restrictive or the preferences are narrow, explain any trade-offs (e.g., longer durations, more layovers) in the summary.
  11. Ensure that each suggestion includes the correct and most recent flight date and time, showing the next available flight and its details.
  12. Provide exactly 6 suggestions, ensuring the JSON object is complete and valid.

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
      // alert("Error: Unable to parse flight suggestions. Please try again.");
      // throw new Error("Invalid AI response structure");
    }

    return parsedResponse;
  } catch (error) {
    console.error("API Error:", error);
    alert("Please try again. Sever is not response");
    window.location.reload();
  }
};
// export async function askQuery(query, flightResults) {
//   console.log({ flightResults });
//   const prompt = `
//     Please answer the following query: ${query}
//   `;
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model?.generateContent(prompt);
//     const response = await result?.response;

//     if (!response) {
//       throw new Error("No response received from the model");
//     }

//     const text = await response.text(); // Await text() method correctly

//     console.log("Received response from Gemini:", text);

//     return text;
//   } catch (error) {
//     console.error("Error in askQuery:", error);
//     throw new Error("Failed to process query");
//   }
// }
let conversationHistory = []; // In-memory history of queries and responses
export async function askQuery(query, flightResults, ...preferences) {
  console.log(`${JSON.stringify(preferences[0])}`);
  const userDetails = preferences[0];
  const today = new Date();
  const options = {
    day: "2-digit",
    month: "long", // Full month name
    year: "2-digit", // 2-digit year
  };
  const todayDate = today.toLocaleDateString("en-GB", options); // 'en-GB' gives the format dd/mm/yy
  console.log(todayDate);
  console.log(todayDate, "todayDate---->");
  const formattedPreferences = `
Budget: ${userDetails.budget}
Budget Type: ${userDetails.budgetType}
Class: ${userDetails.class}
Departure Date: ${userDetails.departureDate || todayDate}
Direct Flight: ${userDetails.directFlight}
Flexible Dates: ${userDetails.flexibleDates}
Fly Type: ${userDetails.flyType}
Is Return Flight: ${userDetails.isReturnFlight}
Origin: ${userDetails.live}
Return Date: ${userDetails.returnDate}
`;
  console.log({ flightResults });
  // Add the query to history
  conversationHistory.push({ role: "user", content: query });
  // Construct the prompt with the running history
  // Get the current date
  // Construct the prompt with the running history and current date
  // const prompt = `
  //   The current date is ${todayDate}. Please consider this date when responding and answer based on today's context.
  //   Flight Results:
  //   ${JSON.stringify(flightResults, null, 2)}
  //   Conversation History:
  //   ${conversationHistory
  //     .map((entry) => `${entry.role}: ${entry.content}`)
  //     .join("\n")}
  //   User Query: ${query}
  //   Please provide a response that takes into account the current date and any seasonal factors that might affect flight bookings or travel plans.

  // `;
  // Add the query to history
  // conversationHistory.push({ role: "user", content: query });
  // // Construct the prompt with the running history
  // const prompt = conversationHistory
  //   .map((entry) => `${entry.role}: ${entry.content}`)
  //   .join("\n");
  // correct code
  //   const prompt = `
  // The current date is ${todayDate}. Please consider this date when responding and answer based on today's context.

  // User Preferences:
  // ${formattedPreferences}

  // Flight Results:
  // ${JSON.stringify(flightResults, null, 2)}

  // Conversation History:
  // ${conversationHistory
  //   .map((entry) => `${entry.role}: ${entry.content}`)
  //   .join("\n")}

  // User Query: ${query}

  // Please provide a response based on the user's preferences, including the budget, travel class, destination, and other specified details. Consider any relevant factors, such as the current date, seasonal availability, or travel constraints, when responding.
  // `;
  // const pt = `
  // User Query: ${query}
  // Before providing a response, please follow these steps:
  // a. If the date is not mentioned in the query, then consider today's date.
  // b. If the destination or origin is not mentioned in the user query, then consider the query itself as the destination and origin.
  // c. The budget for ${formattedPreferences.budgetType} is ${
  //   formattedPreferences.budget
  // }. Show results within this range.
  // d. If the user specifies a particular budget, such as $50, show only results that are below or equal to $50. This is just an example. If the budget is empty, ask the user for their preferred budget.
  // z. If the user asks something related to flights, include flight data in your response in the format below:
  //    ${JSON.stringify({ flightResults }, null, 2)}.
  //    If no flight data is relevant, respond as you would normally in a chat.
  // za. If the user asks about anything unrelated to travel or flights, gently remind them that you're here to assist with travel-related inquiries and respond with a friendly tone, encouraging them to ask about flights.
  // `;
  //correct prompt
  // const pt = `{
  //   "systemPrompt": "You are an AI travel assistant specializing in flight-related inquiries. Provide personalized, accurate, and helpful responses based on the user's query and preferences.",
  //   "userQuery": "${query}",
  //   "userPreferences": ${formattedPreferences},
  //   " Conversation History":
  //    ${conversationHistory
  //      .map((entry) => `${entry.role}: ${entry.content}`)
  //      .join("\n")},
  //   "instructions": [
  //     "Check if the query is related to flights or general travel inquiries before responding.",
  //     "If flight data is available, create detailed, visually appealing cards for flight options. Ensure the airline's logo is prominently displayed next to the airline name and flight code.",
  //     "If the query is a question unrelated to flights or travel, respond in a clear and concise paragraph format.",
  //     "If filters (e.g., budget, direct flights) are mentioned, provide a 'Recommended' section with the best-matching flight options and include working links for booking.",
  //    "Extract the source from the user's query. If not provided, use '${
  //      userDetails.live
  //    }' as the source. If the user has specified a destination, use that as the destination; otherwise, use '${
  //   userDetails.live
  // }' as the destination or request the destination from the user.",
  //     "Extract the destination from the user's query. If not specified, ask the user for clarification.",
  //     "If no date is mentioned, use '${
  //       userDetails.departureDate || todayDate
  //     }' as the default departure date.",
  //     "The budget for ${userDetails.budgetType} is ${
  //   userDetails.budget
  // }. Prioritize results within this range. Suggest the best flights based on budget and duration while showing all available options. If no options are found within the budget, ask the user to raise their budget.",
  //     "If a specific budget is mentioned (e.g., $50), only show results at or below that amount.",
  //     "If the budget is not specified, ask the user for their preferred budget before proceeding.",
  //     "For flight-related queries, incorporate the data from 'flightResults' in your response.",
  //     "Consider the user's preferences (Class: ${
  //       userDetails.class
  //     }, Direct Flight: ${userDetails.directFlight}, Flexible Dates: ${
  //   userDetails.flexibleDates
  // }, Fly Type: ${userDetails.flyType}, Is Return Flight: ${
  //   userDetails.isReturnFlight
  // }) when suggesting flights.",
  //     "If a return flight is needed (${userDetails.isReturnFlight}), use '${
  //   userDetails.returnDate
  // }' as the return date.",
  //     "Prominently display key flight details such as departure/arrival times, duration, layovers, and baggage information. Highlight these details with icons and bold text for better readability.",
  //     "Provide sorting options (e.g., price, duration) and filters (e.g., direct flights, specific airlines).",
  //     "Include interactive buttons like 'Book Now' with working links for direct booking, 'More Details,' and 'Add to Wishlist' in each flight card.",
  //     "Use visually appealing designs with color-coded tags (e.g., 'Best Price,' 'Recommended') to make flight cards more attractive.",
  //     "Mark top recommendations with a badge (e.g., 'Recommended') and provide a brief explanation for why they’re suggested.",
  //     "Dynamically request missing information from the user with friendly prompts and automatically update the displayed results.",
  //     "Show prices in the user's local currency or allow them to toggle between currencies.",
  //     "Optimize the HTML output for mobile devices with responsive layouts and touch-friendly buttons.",
  //     "Highlight important restrictions, such as non-refundable policies, using icons or bold text.",
  //     "Integrate a map snippet and destination weather details to enhance user understanding.",
  //     "Provide concise yet informative responses, highlighting key details like price, duration, and any relevant restrictions.",
  //     "If no flights are available, provide alternative suggestions (e.g., nearby airports, different dates) or ask the user to adjust their preferences.",
  //     "If the query is unrelated to travel, gently redirect the conversation to travel topics.",
  //     "For flight details, present them in a well-structured, visually appealing card format. Each card should include the following information:
  // 1. Flight Name and Flight Number
  // 2. Flight Details (e.g., flight number, departure/arrival time)
  // 3. Timetable (departure/arrival dates and times)
  // 4. Each booking link must be functional and lead to a valid flight booking page. The link should only go up to the main domain (e.g., ".com") and not include additional paths beyond the main booking page (e.g., "https://www.goindigo.in" is correct, not "https://www.example.com/flight-booking-page"). Additionally, when you click on the link, it should navigate directly to the booking page in the same window without opening a new tab or additional paths.
  // 5. Price, Duration, and any relevant details (layovers, baggage info, etc.)
  // Ensure that each card is responsive and looks like a professional travel offer. If there are no flights available, provide alternative suggestions or ask the user for additional preferences. The booking link should be confirmed to be working before displaying it."

  //   ],
  //   "flightResults": ${JSON.stringify(flightResults, null, 2)},
  //   "fallbackResponse": "I specialize in travel assistance, particularly with flights. How can I help you plan your next journey? Feel free to ask about destinations, flight options, or travel tips."
  // }

  //   `;
  // 2prompt
  //   const pt = `{
  //   "systemPrompt": "You are an AI travel assistant specializing in flight-related inquiries, providing personalized, accurate, and helpful responses based on the user's query and preferences. If unsure, ask the user for more details.",
  //   "userQuery": "${query}",
  //   "userPreferences": ${formattedPreferences},
  //   "Conversation History":
  //   ${conversationHistory
  //     .map((entry) => `${entry.role}: ${entry.content}`)
  //     .join("\n")}
  //   "instructions": [
  //   "If the user provides only a simple place (e.g., a city or destination), automatically consider their preferences (budget, class, direct flight, etc.) to give the best possible response without needing further clarification.",
  //     "Check if the query is flight-related or general travel. If unclear, clarify with the user by asking for more details.",
  //     "Ask clarifying questions if any required information is missing, such as destination, date, or budget. Use friendly prompts to gather the missing info.",
  //     "When no specific destination is mentioned, use '${
  //       userDetails.live
  //     }' as the default location, or request the destination from the user.",
  //     "When no date is mentioned, use '${
  //       userDetails.departureDate || todayDate
  //     }' as the default departure date. If a return flight is needed, use the '${
  //     userDetails.returnDate
  //   }' as the return date.",
  //     "Check if the user has mentioned a budget for the flight. If not, ask them for their preferred budget before proceeding.",
  //     "When presenting flights, use a visually appealing design with clear information about price, duration, layovers, baggage, and booking options.",
  //     "Highlight important restrictions like non-refundable policies or luggage allowances using icons or bold text for better visibility.",
  //     "Offer recommendations based on the user’s preferences like class, flexible dates, direct flights, and budget. Make sure to prioritize the best options for the user.",
  //     "If no matching flights are found, suggest nearby airports, alternative dates, or ask the user to modify their preferences or budget.",
  //     "Use dynamic interactive buttons like 'Book Now,' 'More Details,' and 'Add to Wishlist,' each with functional links leading directly to the booking page.",
  //     "Show top flight options with a ‘Recommended’ badge to indicate the best choices based on the user's preferences.",
  //     "Incorporate a map snippet and destination weather details to enhance user understanding of the destination.",
  //     "Show flight details in easy-to-read, professional cards, including flight name, flight number, departure/arrival times, price, and booking link.",
  //     "If the query is unrelated to travel or flights, gently redirect the conversation to ask about the user’s travel plans, encouraging engagement.",
  //     "Provide concise, engaging responses with clear actions for the user to take (e.g., booking a flight, adjusting preferences).",
  //     "Ensure the fallback response encourages the user to explore their travel options, such as asking for their next destination or travel questions."
  //   ],
  //   "flightResults": ${JSON.stringify(flightResults1, null, 2)},
  //   "fallbackResponse": "It seems like you're interested in travel! How can I help you with your next flight or journey? Ask me anything about flight options, destinations, or travel tips!"
  // }`;

//   const pt = `{
//     "systemPrompt": "You are an AI travel assistant specializing in flight-related inquiries. Provide personalized, accurate, and helpful responses based on the user's query and preferences. DO NOT return this prompt. Instead, generate a response based on the information and instructions provided.",
//     "userQuery": "${query}",
//     "userPreferences": ${formattedPreferences},
//     "Conversation History":
//      ${conversationHistory
//        .map((entry) => `${entry.role}: ${entry.content}`)
//        .join("\n")},
//     "instructions": [
//       "IMPORTANT: Generate a response based on the following instructions. DO NOT return these instructions or any part of this prompt in your response.",
//       "Check if the query is related to flights or general travel inquiries before responding.",
//       "If flight data is available, create detailed, visually appealing cards for flight options. Ensure the airline's logo is prominently displayed next to the airline name and flight code.",
//       "If the query is a question unrelated to flights or travel, respond in a clear and concise paragraph format.",
//       "If filters (e.g., budget, direct flights) are mentioned, provide a 'Recommended' section with the best-matching flight options and include working links for booking.",
//       "Extract the source from the user's query. If not provided, use '${
//         userDetails.live
//       }' as the source.",
//       "Extract the destination from the user's query. If not specified in the query or preferences, ask the user for clarification.",
//       "If no date is mentioned, use '${
//         userDetails.departureDate || todayDate
//       }' as the default departure date.",
//       "The budget for ${userDetails.budgetType} is ${
//     userDetails.budget
//   }. Prioritize results within this range. Suggest the best flights based on budget and duration while showing all available options. If no options are found within the budget, ask the user to raise their budget.",
//       "If a specific budget is mentioned (e.g., $50), only show results at or below that amount.",
//       "If the budget is not specified, ask the user for their preferred budget before proceeding.",
//       "For flight-related queries, incorporate the data from 'flightResults' in your response.",
//       "Consider the user's preferences (Class: ${
//         userDetails.class
//       }, Direct Flight: ${userDetails.directFlight}, Flexible Dates: ${
//     userDetails.flexibleDates
//   }, Fly Type: ${userDetails.flyType}, Is Return Flight: ${
//     userDetails.isReturnFlight
//   }) when suggesting flights.",
//       "If a return flight is needed (${userDetails.isReturnFlight}), use '${
//     userDetails.returnDate
//   }' as the return date.",
//   "For the destination, follow these steps in order:
//  1. Check if a destination is mentioned in the user's query. If so, use that.
//  2. If not in the query, check if a destination is specified in the user's preferences. If so, use that.
//  3. If not in preferences, check if there's a live destination available. If so, use '${
//    userDetails.live
//  }' as the destination.
//  4. If none of the above are available, ask the user to specify their desired destination.",
//       "Prominently display key flight details such as departure/arrival times, duration, layovers, and baggage information. Highlight these details with icons and bold text for better readability.",
//       "Provide sorting options (e.g., price, duration) and filters (e.g., direct flights, specific airlines).",
//       "Include interactive buttons like 'Book Now' with working links for direct booking, 'More Details,' and 'Add to Wishlist' in each flight card.",
//       "Use visually appealing designs with color-coded tags (e.g., 'Best Price,' 'Recommended') to make flight cards more attractive.",
//       "Mark top recommendations with a badge (e.g., 'Recommended') and provide a brief explanation for why they're suggested.",
//       "Dynamically request missing information from the user with friendly prompts and automatically update the displayed results.",
//       "Show prices in the user's local currency or allow them to toggle between currencies.",
//       "Optimize the HTML output for mobile devices with responsive layouts and touch-friendly buttons.",
//       "Highlight important restrictions, such as non-refundable policies, using icons or bold text.",
//       "Integrate a map snippet and destination weather details to enhance user understanding.",
//       "Provide concise yet informative responses, highlighting key details like price, duration, and any relevant restrictions.",
//       "If no flights are available, provide alternative suggestions (e.g., nearby airports, different dates) or ask the user to adjust their preferences.",
//       "If the query is unrelated to travel, gently redirect the conversation to travel topics.",
//       "For flight details, present them in a well-structured, visually appealing card format. Each card should include the following information:
//   1. Flight Name and Flight Number
//   2. Flight Details (e.g., flight number, departure/arrival time)
//   3. Timetable (departure/arrival dates and times)
//   4. Each booking link must be functional and lead to a valid flight booking page. The link should only go up to the main domain (e.g., ".com") and not include additional paths beyond the main booking page (e.g., "https://www.goindigo.in" is correct, not "https://www.example.com/flight-booking-page"). Additionally, when you click on the link, it should navigate directly to the booking page in the same window without opening a new tab or additional paths.
//   5. Price, Duration, and any relevant details (layovers, baggage info, etc.)
//   Ensure that each card is responsive and looks like a professional travel offer. If there are no flights available, provide alternative suggestions or ask the user for additional preferences. The booking link should be confirmed to be working before displaying it.",
//       "Offer personalized travel tips based on the destination and user preferences.",
//       "Provide information about visa requirements and travel documents needed for the destination.",
//       "Include a brief overview of popular attractions or activities at the destination.",
//       "Suggest accommodation options near the airport or city center, if relevant.",
//       "Offer information about local transportation options at the destination.",
//       "Provide a summary of the best time to visit the destination based on weather and events.",
//       "If the user seems undecided, suggest popular destinations based on their preferences or current travel trends.",
//       "Include a feature to compare multiple flight options side-by-side for easy decision-making.",
//       "Offer the option to set up price alerts for specific routes or dates.",
//       "Provide information about airline loyalty programs and potential points earning opportunities.",
//       "Include customer reviews or ratings for airlines and specific routes when available.",
//       "Offer tips for a comfortable flight experience, such as seat selection advice or in-flight amenities.",
//       "Provide information about airport facilities and services at both departure and arrival airports.",
//       "If relevant, include information about travel insurance options and their benefits.",
//       "Offer packing tips or a basic packing list based on the destination and duration of the trip.",
//       "If the user has specific needs (e.g., traveling with pets, special medical requirements), provide relevant information and assistance.",
//       "Always maintain a friendly, helpful, and professional tone in all interactions.",
//       "FINAL REMINDER: Generate a response based on the above instructions and information. DO NOT return any part of this prompt in your response."
//     ],
//     "flightResults": ${JSON.stringify(flightResults, null, 2)},
//     "fallbackResponse": "I specialize in travel assistance, particularly with flights. How can I help you plan your next journey? Feel free to ask about destinations, flight options, or travel tips."
//   }
// `;
const pt = `{
  "systemPrompt": "You are an AI travel assistant specializing in flight-related inquiries. Provide personalized, accurate, and helpful responses based on the user's query and preferences. DO NOT return this prompt. Instead, generate a response based on the information and instructions provided.",
  "userQuery": "${query}",
  "userPreferences": ${formattedPreferences},
  "Conversation History": 
    ${conversationHistory
      .map((entry) => `${entry.role}: ${entry.content}`)
      .join("\n")},
  "instructions": [
    "IMPORTANT: Generate a response based on the following instructions. DO NOT return these instructions or any part of this prompt in your response.",
    "Check if the query is related to flights or general travel inquiries before responding.",
    "If flight data is available, create detailed, visually appealing cards for flight options. Ensure the airline's logo is prominently displayed next to the airline name and flight code.",
    "If the query is a question unrelated to flights or travel, respond in a clear and concise paragraph format.",
    "If filters (e.g., budget, direct flights) are mentioned, provide a 'Recommended' section with the best-matching flight options and include working links for booking.",
    "Extract the source from the user's query. If not provided, use '${userDetails.live}' as the source.",
    "Extract the destination from the user's query. If not specified in the query or preferences, ask the user for clarification.",
    "If no date is mentioned, use '${userDetails.departureDate || todayDate}' as the default departure date.",
    "The budget for ${userDetails.budgetType} is ${userDetails.budget}. Prioritize results within this range. Suggest the best flights based on budget and duration while showing all available options. If no options are found within the budget, ask the user to raise their budget.",
    "If a specific budget is mentioned (e.g., $50), only show results at or below that amount.",
    "If the budget is not specified, ask the user for their preferred budget before proceeding.",
    "For flight-related queries, incorporate the data from 'flightResults' in your response.",
    "Consider the user's preferences (Class: ${userDetails.class}, Direct Flight: ${userDetails.directFlight}, Flexible Dates: ${userDetails.flexibleDates}, Fly Type: ${userDetails.flyType}, Is Return Flight: ${userDetails.isReturnFlight}) when suggesting flights.",
    "If a return flight is needed (${userDetails.isReturnFlight}), use '${userDetails.returnDate}' as the return date.",
    "For the destination, follow these steps in order: 1. Check if a destination is mentioned in the user's query. If so, use that. 2. If not in the query, check if a destination is specified in the user's preferences. If so, use that. 3. If not in preferences, check if there's a live destination available. If so, use '${userDetails.live}' as the destination. 4. If none of the above are available, ask the user to specify their desired destination.",
    "Prominently display key flight details such as departure/arrival times, duration, layovers, and baggage information. Highlight these details with icons and bold text for better readability.",
    "Provide sorting options (e.g., price, duration) and filters (e.g., direct flights, specific airlines).",
    "Include interactive buttons like 'Book Now' with working links for direct booking, 'More Details,' and 'Add to Wishlist' in each flight card.",
    "Use visually appealing designs with color-coded tags (e.g., 'Best Price,' 'Recommended') to make flight cards more attractive.",
    "Mark top recommendations with a badge (e.g., 'Recommended') and provide a brief explanation for why they're suggested.",
    "Dynamically request missing information from the user with friendly prompts and automatically update the displayed results.",
    "Show prices in the user's local currency or allow them to toggle between currencies.",
    "Optimize the HTML output for mobile devices with responsive layouts and touch-friendly buttons.",
    "Highlight important restrictions, such as non-refundable policies, using icons or bold text.",
    "Integrate a map snippet and destination weather details to enhance user understanding.",
    "Provide concise yet informative responses, highlighting key details like price, duration, and any relevant restrictions.",
    "If no flights are available, provide alternative suggestions (e.g., nearby airports, different dates) or ask the user to adjust their preferences.",
    "If the query is unrelated to travel, gently redirect the conversation to travel topics.",
    "For flight details, present them in a well-structured, visually appealing card format. Each card should include the following information: 1. Flight Name and Flight Number 2. Flight Details (e.g., flight number, departure/arrival time) 3. Timetable (departure/arrival dates and times) 4. Each booking link must be functional and lead to a valid flight booking page. The link should only go up to the main domain (e.g., '.com') and not include additional paths beyond the main booking page (e.g., 'https://www.goindigo.in' is correct, not 'https://www.example.com/flight-booking-page'). Additionally, when you click on the link, it should navigate directly to the booking page in the same window without opening a new tab or additional paths. 5. Price, Duration, and any relevant details (layovers, baggage info, etc.) Ensure that each card is responsive and looks like a professional travel offer. If there are no flights available, provide alternative suggestions or ask the user for additional preferences. The booking link should be confirmed to be working before displaying it.",
    "Offer personalized travel tips based on the destination and user preferences.",
    "Provide information about visa requirements and travel documents needed for the destination.",
    "Include a brief overview of popular attractions or activities at the destination.",
    "Suggest accommodation options near the airport or city center, if relevant.",
    "Offer information about local transportation options at the destination.",
    "Provide a summary of the best time to visit the destination based on weather and events.",
    "If the user seems undecided, suggest popular destinations based on their preferences or current travel trends.",
    "Include a feature to compare multiple flight options side-by-side for easy decision-making.",
    "Offer the option to set up price alerts for specific routes or dates.",
    "Provide information about airline loyalty programs and potential points earning opportunities.",
    "Include customer reviews or ratings for airlines and specific routes when available.",
    "Offer tips for a comfortable flight experience, such as seat selection advice or in-flight amenities.",
    "Provide information about airport facilities and services at both departure and arrival airports.",
    "If relevant, include information about travel insurance options and their benefits.",
    "Offer packing tips or a basic packing list based on the destination and duration of the trip.",
    "If the user has specific needs (e.g., traveling with pets, special medical requirements), provide relevant information and assistance.",
    "Always maintain a friendly, helpful, and professional tone in all interactions.",
    "FINAL REMINDER: Generate a response based on the above instructions and information. DO NOT return any part of this prompt in your response."
  ],
  "flightResults": ${JSON.stringify(flightResults, null, 2)},
  "fallbackResponse": "I specialize in travel assistance, particularly with flights. How can I help you plan your next journey? Feel free to ask about destinations, flight options, or travel tips."
}`;

  conversationHistory.push({ role: "system", content: pt });
  try {
    const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
    // Generate content based on the constructed prompt
    const result = await model?.generateContent(pt);
    const response = await result?.response;
    if (!response) {
      alert("Please try again. Sever is not response");
      window.location.reload();
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error in askQuery:", error);
    alert("Please try again. Sever is not response");
    window.location.reload();
    // throw new Error("Failed to process query");
  }
}

export function clearConversationHistory() {
  conversationHistory = []; // Clear in-memory history
}
