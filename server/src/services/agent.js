import { GoogleGenAI, Type } from '@google/genai';
import { findProducts, checkStock, recordTransaction } from './tools.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const toolDeclarations = [
    {
        name: 'find_products',
        description: 'Search inventory database for products matching the user description.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                searchPhrase: {
                    type: Type.STRING,
                    description: 'Product name or search term.'
                }
            },
            required: ['searchPhrase']
        }
    },
    {
        name: 'check_stock',
        description: 'Retrieve current stock balance and unit of a selected product by code.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                productCode: {
                    type: Type.STRING,
                    description: 'Unique product code (e.g., SOAP-001).'
                }
            },
            required: ['productCode']
        }
    },
    {
        name: 'record_transaction',
        description: 'Validate and save an approved inventory movement after explicit confirmation.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                productCode: { type: Type.STRING, description: 'Product code' },
                transactionType: { type: Type.STRING, enum: ['sale', 'delivery', 'return'], description: 'Movement type' },
                quantity: { type: Type.NUMBER, description: 'Quantity moved' },
                confirmed: { type: Type.BOOLEAN, description: 'True only if user explicitly confirmed' }
            },
            required: ['productCode', 'transactionType', 'quantity', 'confirmed']
        }
    }
];

const SYSTEM_INSTRUCTION = `
You are the AI Inventory Operations Agent for a small business.
Your primary role is turning natural-language sales, delivery, or return instructions into validated stock operations.

Rules:
1. Always find the product using "find_products".
2. If multiple products match (e.g. SoftCare Soap vs SoftCare Soap Plus), STOP and ask the user to clarify which one they mean.
3. Check stock using "check_stock". Never invent stock figures.
4. Calculate proposed balance:
   - For SALE: Proposed Balance = current - quantity
   - For DELIVERY: Proposed Balance = current + quantity
   - For RETURN: Proposed Balance = current + quantity
5. Present a clear TRANSACTION PREVIEW in this exact format:
Action: [sale / delivery / return]
Product: [Name] ([Code])
Quantity: [Quantity]
Current Stock: [Current]
Proposed Balance: [New]

Do you confirm this transaction?
6. NEVER execute "record_transaction" until the user explicitly responds with confirmation (e.g., "yes", "confirm", "proceed").
`;

export async function processAgentChat(userMessage, chatHistory = []) {
    const model = 'gemini-3.5-flash-lite';

    const chat = ai.chats.create({
        model,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ functionDeclarations: toolDeclarations }],
            temperature: 0.1
        },
        history: chatHistory.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }))
    });

    let response = await chat.sendMessage({ message: userMessage });
    let lastToolUsed = null;
    let lastToolData = null;

    // Loop as long as Gemini wants to execute function calls (e.g., find_products THEN check_stock)
    while (true) {
        const functionCalls = typeof response.functionCalls === 'function'
            ? response.functionCalls()
            : response.functionCalls;

        if (!functionCalls || functionCalls.length === 0) {
            break;
        }

        const call = functionCalls[0];
        lastToolUsed = call.name;
        let toolResult;

        if (call.name === 'find_products') {
            toolResult = await findProducts(call.args);
        } else if (call.name === 'check_stock') {
            toolResult = await checkStock(call.args);
        } else if (call.name === 'record_transaction') {
            toolResult = await recordTransaction(call.args);
        }
        lastToolData = toolResult;

        // Send the tool response back into the conversation
        response = await chat.sendMessage({
            message: [{
                functionResponse: {
                    name: call.name,
                    response: { result: toolResult }
                }
            }]
        });
    }

    return {
        reply: response.text || 'I processed your request, but received no descriptive text.',
        toolUsed: lastToolUsed,
        toolData: lastToolData
    };
}