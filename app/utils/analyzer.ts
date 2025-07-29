"use server";

import {OpenAI} from "openai";

export type PersonalityAnalysis = {
    mbtiType: string;
    //0-100 for all traits
    traits: {
        openness: number; 
        conscientiousness: number; 
        extraversion: number; 
        agreeableness: number; 
        neuroticism: number; 
    };
    communicationStyle: string;
    strengths: string[];
    challenges: string[];
    compatibleTypes: string[];
    recommendedContent: string[];
};

//Using OpenAI API for analysis
export async function analyzeText(userMessages: string[]): Promise<PersonalityAnalysis> {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Combine messages but limit total length to avoid token limits
        const combinedText = userMessages.join("\n\n").slice(0, 15000);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a personality analysis expert. Analyze the following text from a user's chat history and determine:
          1. Their MBTI personality type
          2. Their Big Five personality traits (openness, conscientiousness, extraversion, agreeableness, neuroticism) as scores from 0-100
          3. Their communication style
          4. Their key strengths (3-5 items)
          5. Their potential challenges (3-5 items)
          6. MBTI types they would be most compatible with (2-3 types)
          7. Content recommendations based on their personality (3-5 items)
          
          Respond in JSON format only, with this structure:
          {
            "mbtiType": "XXXX",
            "traits": {
              "openness": 0-100,
              "conscientiousness": 0-100,
              "extraversion": 0-100,
              "agreeableness": 0-100,
              "neuroticism": 0-100
            },
            "communicationStyle": "description",
            "strengths": ["strength1", "strength2", ...],
            "challenges": ["challenge1", "challenge2", ...],
            "compatibleTypes": ["XXXX", "YYYY", ...],
            "recommendedContent": ["recommendation1", "recommendation2", ...]
          }`,
                },
                {
                    role: "user",
                    content: combinedText,
                },
            ],
            response_format: {type: "json_object"},
        });

        const analysisText = response.choices[0]?.message?.content || "{}";
        const analysis = JSON.parse(analysisText) as PersonalityAnalysis;

        return analysis;
    } catch (error) {
        console.error("OpenAI analysis error:", error);

        // Fallback to basic analysis if OpenAI fails
        return fallbackAnalysis(userMessages);
    }
}

// Fallback method: Basic text analysis without external APIs
function fallbackAnalysis(userMessages: string[]): PersonalityAnalysis {
    const combinedText = userMessages.join(" ").toLowerCase();

    // Very basic keyword analysis - this is just a demonstration
    // In a real implementation, you would use more sophisticated NLP techniques

    // Analyze extraversion based on simple word frequency
    const extraversionWords = ["we", "us", "together", "party", "social", "group", "people"];
    const introversionWords = ["i", "me", "alone", "quiet", "individual", "book", "myself"];

    let extraversionScore = 50; // Start at neutral
    extraversionWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) extraversionScore += matches.length * 2;
    });

    introversionWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) extraversionScore -= matches.length * 2;
    });

    // Clamp 
    extraversionScore = Math.max(0, Math.min(100, extraversionScore));

    // Similar simple analyses for other traits
    // This is extremely simplified and not accurate for real use

    // Determine MBTI type based on simple heuristics
    let mbtiType = "";

    // E vs I
    mbtiType += extraversionScore > 50 ? "E" : "I";

    // S vs N (sensing vs intuition)
    const sensingWords = ["detail", "specific", "practical", "reality", "fact"];
    const intuitionWords = ["idea", "concept", "theory", "imagine", "possibility"];

    let sensingScore = 0;
    sensingWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) sensingScore += matches.length;
    });

    let intuitionScore = 0;
    intuitionWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) intuitionScore += matches.length;
    });

    mbtiType += intuitionScore > sensingScore ? "N" : "S";

    // T vs F (thinking vs feeling)
    const thinkingWords = ["logic", "analyze", "objective", "rational", "system"];
    const feelingWords = ["feel", "value", "harmony", "emotion", "care"];

    let thinkingScore = 0;
    thinkingWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) thinkingScore += matches.length;
    });

    let feelingScore = 0;
    feelingWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) feelingScore += matches.length;
    });

    mbtiType += thinkingScore > feelingScore ? "T" : "F";

    // J vs P (judging vs perceiving)
    const judgingWords = ["plan", "organize", "decide", "structure", "control"];
    const perceivingWords = ["flexible", "adapt", "spontaneous", "option", "explore"];

    let judgingScore = 0;
    judgingWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) judgingScore += matches.length;
    });

    let perceivingScore = 0;
    perceivingWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = combinedText.match(regex);
        if (matches) perceivingScore += matches.length;
    });

    mbtiType += judgingScore > perceivingScore ? "J" : "P";

    // Generate other personality aspects based on the determined type
    return {
        mbtiType,
        traits: {
            openness: Math.floor(Math.random() * 30) + 40, // Random between 40-70
            conscientiousness: judgingScore > perceivingScore ? 70 : 40,
            extraversion: extraversionScore,
            agreeableness: feelingScore > thinkingScore ? 70 : 40,
            neuroticism: Math.floor(Math.random() * 40) + 30, // Random between 30-70
        },
        communicationStyle: extraversionScore > 70 ? "Direct and expressive" : extraversionScore < 30 ? "Thoughtful and measured" : "Balanced and adaptable",
        strengths: ["Good at analyzing complex situations", "Effective at communicating ideas", "Able to see multiple perspectives", "Strong problem-solving abilities"],
        challenges: ["May overthink decisions at times", "Can struggle with time management", "Occasionally has difficulty with detailed follow-through"],
        compatibleTypes: mbtiType.startsWith("I") ? ["ENFJ", "ENTP"] : ["INFP", "ISTP"],
        recommendedContent: ["Thinking, Fast and Slow by Daniel Kahneman", "The Power of Habit by Charles Duhigg", "Quiet: The Power of Introverts in a World That Can't Stop Talking by Susan Cain"],
    };
}
