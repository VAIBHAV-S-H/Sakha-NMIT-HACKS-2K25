import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, StartChatParams, Content, FunctionDeclarationsTool, FunctionDeclaration, Part, Tool, GenerativeModel, ChatSession, EnhancedGenerateContentResponse, FunctionCall, Schema, SchemaType } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Directly hardcoded API key - replace with your actual valid key
// Using AIzaSyDujzLUo3UEDJed-PZUtHphS0P9kn94qB8 as example (not real)
const GEMINI_API_KEY = "AIzaSyDujzLUo3UEDJed-PZUtHphS0P9kn94qB8";
console.log("STARTUP DEBUG: Using direct GEMINI_API_KEY: " + GEMINI_API_KEY?.substring(0, 5) + "...");

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Safety settings for the model
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Function declaration for getting threat level
const GET_THREAT_LEVEL_FUNCTION_NAME = 'get_threat_level_for_location';
const getThreatLevelFunctionDeclaration: FunctionDeclaration = {
  name: GET_THREAT_LEVEL_FUNCTION_NAME,
  description: "Get the current threat level and safety summary for a specific geographic location, address, landmark, or general area based on user reports and safety data. Use this if the user asks about the safety of a particular place.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      location_name: {
        type: SchemaType.STRING,
        description: "The specific address, landmark name, or general area the user is asking about (e.g., 'Yelahanka, Bangalore', 'Times Square, New York', 'Main Street Park', 'the corner of 5th and Elm').",
      },
    },
    required: ['location_name'],
  },
};

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "get_threat_level_for_location",
        description: "Provides safety and threat level information for a given location. Use this for queries like 'Is [location] safe?' or 'Safety information for [area]'. If the user asks about a general area, try to provide information about specific sub-locations if available. If the user mentions a very specific address, provide information for the broader area if the specific address is not found.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            location_name: {
              type: SchemaType.STRING,
              description: "The name of the location to get safety information for (e.g., 'Yelahanka', 'Cubbon Park', '123 Main St, Koramangala').",
            },
          },
          required: ["location_name"],
        },
      },
      {
        name: "find_companion_for_travel",
        description: "Initiates a request to find a travel companion for a specified journey. Use this when a user explicitly states they want to find someone to travel with.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            departure_location: {
              type: SchemaType.STRING,
              description: "The starting point of the travel.",
            },
            destination_location: {
              type: SchemaType.STRING,
              description: "The destination of the travel.",
            },
            travel_time: {
              type: SchemaType.STRING,
              description: "The proposed time or date of travel (e.g., 'tonight at 8 PM', 'tomorrow morning', 'next Tuesday').",
            },
          },
          required: ["departure_location", "destination_location", "travel_time"],
        },
      },
    ],
  },
];

const systemInstructionText = `You are Sakha's safety assistant, specializing in women's safety and security.
Your primary purpose is to provide helpful information about:
1. Safety tips for women
2. How to use the Sakha application's features (safety maps, route planning, threat reporting)
3. General safety advice for specific situations
4. Emergency response suggestions

When a user asks about the safety of a specific location, address, landmark, or a general area you MUST use the '${GET_THREAT_LEVEL_FUNCTION_NAME}' function to get the latest safety information for that place before answering. If the user provides a broad area name (e.g., a neighborhood or locality), you can provide a general summary for that area if available, mention safety for a few known points within it, or ask for a more specific point of interest if the function returns no specific details for the broad area.

Important context about Sakha:
- Sakha is a women's safety app with safety maps showing safe and unsafe areas
- It allows users to report threats and view community-reported unsafe locations
- Users can plan safe routes that avoid high-risk areas
- The app has features like geofencing, emergency contacts, and threat reporting

---
**MANDATORY INSTRUCTIONS FOR APP FEATURE QUESTIONS**
For ANY questions about how Sakha app features work (like Safety Map, Route Planning, Threat Reporting, Safety Zones, Emergency Features), you MUST use the information provided below in the 'SPECIFIC FEATURE DETAILS' section. DO NOT state you cannot answer or that you need a tool for these types of questions. Your knowledge about these features comes DIRECTLY from the text provided here.

Specifically, if the user asks about "Safety Zones" (e.g., "What are safety zones on the map?"), you MUST explain them using the "Safety Zones" subsection below.
---

SPECIFIC FEATURE DETAILS:

Safety Map:
- Shows safe zones (green), caution zones (orange), and danger zones (red)
- Displays reported threat locations with severity levels
- Users can right-click on the map to report unsafe areas
- Users can view threat details by clicking on markers

Route Planning:
- Users can set start and destination points on the map
- The app calculates routes that avoid high-risk areas
- Route options include avoiding highways, tolls, and unsafe areas
- Shows estimated travel time and distance

Threat Reporting:
- Users can report unsafe locations with details like threat type, description, and severity
- Reports can be verified by other community members
- Categories include harassment, theft, assault, poor lighting, isolation, etc.

Safety Zones:
- Users can see geofenced safety zones on the map
- Green zones indicate areas with good security measures
- Orange zones require caution, especially at night
- Red zones indicate areas with reported safety issues

Emergency Features:
- Quick access to emergency contacts
- SOS button to alert contacts with location
- Voice commands for hands-free operation in emergencies

SPECIFIC Q&A / KNOWLEDGE BASE:

# Add your specific questions and answers or detailed knowledge points here.
# Example Format for Q&A:
# Q: How do I add an emergency contact?
# A: Go to the 'Emergency Contacts' section in your profile, tap 'Add Contact', and select from your phone book or enter details manually.

# Example Format for Knowledge Point:
# Detailed SOS Activation: The SOS button, once pressed for 3 seconds, will immediately send your current location and a distress message to all your listed emergency contacts. It will also, if enabled, sound a loud alarm on your phone.

# Add more specific Q&A pairs here.
# Example:
# Q: What are the general safety tips for solo travelers?
# A: Always be aware of your surroundings, share your itinerary with someone you trust, avoid poorly lit areas at night, and keep your valuables secure.
# Q: How do I use the "Find Companion" feature?
# A: Simply tell me "I want to find a companion to travel from [departure] to [destination] around [time/date]" or "Find me a travel buddy for a trip to [place]".
# Q: How do I report an emergency?
# A: The app has an SOS button for immediate emergencies. For non-urgent issues, you can report them through the app's help section.

Remember, for general questions about app features, use the information provided above in 'SPECIFIC FEATURE DETAILS'. Only use tools when explicitly instructed below for specific dynamic data retrieval, like location-specific threat levels or finding a travel companion.

TOOL USE INSTRUCTIONS:
- When asked for safety information about a specific location (e.g., "Is Yelahanka safe?", "Tell me about safety in Koramangala", "Safety info for Cubbon Park"), use the 'get_threat_level_for_location' function. Provide the full location name as the 'location_name' argument.
- When a user expresses a desire to find a travel companion (e.g., "I want to find a companion to travel from [departure] to [destination] around [time/date]", "Find me a travel buddy for a trip to [place]"), use the 'find_companion_for_travel' function. Provide 'departure_location', 'destination_location', and 'travel_time' (can be a specific time or a general period like "tonight", "tomorrow morning"). Ensure you have all three pieces of information from the user before calling the function; if not, ask for the missing information first. When inferring or generating any details for these arguments if not fully specified by the user, ensure they are general, hypothetical, and strictly adhere to safety guidelines (e.g., avoid generating realistic-sounding specific addresses or personal details if not provided by the user).

Always prioritize user safety in your responses. Be concise, helpful, and empathetic.
If asked about life-threatening situations, always advise contacting emergency services (911/112/local emergency number) first.
Do not provide advice that could put users in danger.

Respond in a friendly, conversational tone using short paragraphs.`;

interface GetThreatLevelArgs {
  location_name?: string;
}

interface FindCompanionArgs {
  departure_location?: string;
  destination_location?: string;
  travel_time?: string;
}

const MODEL_NAME = "models/gemini-1.5-flash";

export async function POST(req: NextRequest) {
  console.log("DEBUG: POST request to chatbot API received");
  console.log("DEBUG: Using GEMINI_API_KEY: " + GEMINI_API_KEY?.substring(0, 5) + "...");
  
  // For demonstration purposes, return a direct message if using the example key
  if (GEMINI_API_KEY === 'AIzaSyDujzLUo3UEDJed-PZUtHphS0P9kn94qB8') {
    console.log("DEBUG: Using example API key - returning placeholder response");
    return NextResponse.json({
      response: "This is a placeholder response since you're using the example API key. Replace it with your actual Gemini API key in app/api/chatbot/route.ts."
    });
  }
  
  try {
    const { messages: clientMessages } = await req.json();

    if (!clientMessages || !Array.isArray(clientMessages) || clientMessages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request format. Non-empty messages array required.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings,
      tools: tools,
    });

    // The last message from the client is the current user query.
    const latestUserMessage = clientMessages[clientMessages.length - 1];
    if (latestUserMessage.role !== 'user') {
        return NextResponse.json(
            { error: 'Invalid request: Last message must be from user.' },
            { status: 400 }
        );
    }

    const historyMessages = clientMessages
      .slice(0, -1)
      .filter(msg => 
        msg.id !== 'welcome' && 
        !(msg.role === 'assistant' && msg.content === "You can ask me about:") &&
        !(msg.role === 'tool') // Exclude previous tool responses from direct history for next user turn
      );

    const conversationalHistory: Content[] = historyMessages.map(msg => {
      // Ensure parts is always an array of Part objects
      let partsArray: Part[];
      if (Array.isArray(msg.parts)) {
        partsArray = msg.parts;
      } else if (typeof msg.content === 'string') {
        partsArray = [{ text: msg.content }];
      } else {
        partsArray = []; // Should not happen if types are consistent
      }
      return {
        role: msg.role === 'user' ? 'user' : (msg.role === 'assistant' ? 'model' : msg.role as 'user' | 'model' | 'tool'),
        parts: partsArray,
      };
    });
    
    if (conversationalHistory.length > 0 && conversationalHistory[0].role !== 'user') {
        console.warn("Conversational history does not start with a user message after filtering. History:", conversationalHistory);
    }

    const chatSessionParams: StartChatParams = {
        history: conversationalHistory.length > 0 ? conversationalHistory : undefined,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.95,
            topK: 40,
        },
    };
    
    const chat = model.startChat(chatSessionParams);
    let messageToSendToGemini: Part[]; // Will be a Part object

    if (conversationalHistory.length === 0) {
      // If no history, prepend system prompt to the user parts
      messageToSendToGemini = [
        { text: systemInstructionText },
        { text: `\n\nUSER_QUERY_START\n${latestUserMessage.content}\nUSER_QUERY_END` }
      ];
    } else {
      messageToSendToGemini = [{ text: latestUserMessage.content }];
    }

    let result = await chat.sendMessage(messageToSendToGemini);
    let loopCount = 0;
    const MAX_LOOPS = 7; // Prevent infinite loops, increased from 5

    while(loopCount < MAX_LOOPS) {
        const response = result.response;
        const functionCall = response.functionCalls()?.[0];
        if (!functionCall) {
            break; // No function call, break and respond to user
        }

        console.log("Function call requested by model:", JSON.stringify(functionCall, null, 2));

        let parts: Part[] = [];

        if (functionCall.name === "get_threat_level_for_location") {
          const args = functionCall.args as GetThreatLevelArgs;
          const location = args.location_name;
          console.log("Function call: get_threat_level_for_location, args:", args);

          // Placeholder logic for fetching threat data
          let threatData: {
            location: string | undefined;
            threatLevel: string;
            details: string;
            recommendations?: string;
            subLocations?: any[];
            reported_threats?: any[];
          } = {
            location: location,
            threatLevel: "Unknown",
            details: "No specific information available for this exact location. Always exercise general caution.",
            recommendations: "Be aware of your surroundings, avoid displaying valuables openly.",
            subLocations: []
          };

          if (location?.toLowerCase().includes("dangerous place")) {
            threatData = {
              location: location,
              threatLevel: "High",
              details: "Multiple recent threat reports including theft and harassment. Avoid if possible, especially at night.",
              reported_threats: [{type: "Theft", description: "Phone snatched", date: "2024-05-20"}]
            };
          } else if (location?.toLowerCase().includes("yelahanka")) {
            threatData = {
              location: "Yelahanka, Bangalore",
              threatLevel: "Moderate",
              details: "Yelahanka is a developing area. While generally safe during the day, some sub-areas require caution, especially at night. Main roads are usually fine.",
              recommendations: "Stick to well-lit areas, be cautious in less populated bylanes. Good to check for recent local advisories if any.",
              subLocations: [
                { name: "Yelahanka New Town", threatLevel: "Low", details: "Residential, generally safe." },
                { name: "Yelahanka Old Town", threatLevel: "Moderate", details: "More crowded, be mindful of belongings." },
                { name: "Attur Layout", threatLevel: "Moderate", details: "Some isolated spots, avoid late night travel alone." }
              ]
            };
          } else if (location?.toLowerCase().includes("safe park")) {
            threatData = {
              location: location,
              threatLevel: "Low",
              details: "Generally considered safe with good lighting and community presence.",
              reported_threats: []
            };
          } else {
            threatData = {
              location: location,
              threatLevel: "Unknown",
              details: "No specific real-time threat data available for this exact location. Exercise general caution or specify a known landmark.",
              reported_threats: []
            };
          }

          parts = [
            {
              functionResponse: {
                name: "get_threat_level_for_location",
                response: {
                  name: "get_threat_level_for_location", // Content API requires name for FunctionResponse
                  content: threatData,
                },
              },
            },
          ];
        } else if (functionCall.name === "find_companion_for_travel") {
          const args = functionCall.args as FindCompanionArgs;
          const departure = args.departure_location;
          const destination = args.destination_location;
          const time = args.travel_time;
          console.log("Function call: find_companion_for_travel, args:", args);

          // Placeholder logic for finding a companion
          let companionResponse = {
            status: "SEARCHING",
            message: `Looking for a companion to travel from ${departure} to ${destination} around ${time}. I will notify you if someone accepts.`,
            requestId: `REQ-${Date.now()}`
          };

          // Simulate finding a companion for a specific request for testing
          if (departure?.toLowerCase().includes("home") && destination?.toLowerCase().includes("work")) {
            companionResponse = {
              status: "MATCH_FOUND",
              message: `Great news! We found a companion, Alex, who is also traveling from ${departure} to ${destination} around ${time}. Alex's contact details have been shared. Please confirm if you'd like to proceed.`,
              requestId: `REQ-${Date.now()}`
            };
          } else if (departure?.toLowerCase().includes("airport") && destination?.toLowerCase().includes("hotel")) {
             companionResponse = {
              status: "NO_MATCH_FOUND",
              message: `Unfortunately, we couldn't find a readily available companion for your trip from ${departure} to ${destination} around ${time} right now. We'll keep searching and notify you.`,
              requestId: `REQ-${Date.now()}`
            };
          }

          parts = [
            {
              functionResponse: {
                name: "find_companion_for_travel",
                response: {
                  name: "find_companion_for_travel", // Content API requires name for FunctionResponse
                  content: companionResponse,
                },
              },
            },
          ];
        } else {
          // Should not happen if model is behaving
          console.error("Unknown function call:", functionCall.name);
          throw new Error(`Unknown function call: ${functionCall.name}`);
        }

        // Send the function response back to the model
        result = await chat.sendMessage(parts);
        loopCount++;
    }

    if (loopCount >= MAX_LOOPS) {
        console.error("Max function call loops reached. Returning last known response.");
        // Fallback or error response to user
        return NextResponse.json({ response: "Sorry, I encountered an issue while trying to process that request with my tools. Please try again." });
    }

    const responseText = result.response.text();
    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error('Error processing chatbot request:', error);
    let errorMessage = 'Failed to process request';
    if (error.message) {
        errorMessage = error.message;
    }
    // Check for specific GoogleGenerativeAIError properties if available
    if (error.name === 'GoogleGenerativeAIError' || error.message?.includes('[GoogleGenerativeAI Error]')) {
        // Pass through more detailed error from Gemini if possible
        const detail = error.errorDetails || error.message;
        return NextResponse.json(
            { error: `Gemini API Error: ${detail}` },
            { status: (error.httpErrorCode || 500) } // Use httpErrorCode if available
        );
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 