"use server";

import {parseChatGPTData} from "./utils/parser";
import {analyzeText} from "./utils/analyzer";
import {generatePersonalityReport} from "./utils/report-generator";

export async function analyzePersonality(formData: FormData): Promise<string> {
    try {
   
        const file = formData.get("file") as File;
        if (!file) {
            throw new Error("No file provided");
        }

        const chatData = await parseChatGPTData(file);

        if (chatData.userMessages.length === 0) {
            return "We couldn't find any user messages in the provided file. Please make sure you're uploading a valid ChatGPT export file.";
        }

        const analysisResults = await analyzeText(chatData.userMessages);

        const report = generatePersonalityReport(analysisResults);

        return report;
    } catch (error) {
        console.error("Analysis error:", error);
        return `An error occurred during analysis: ${error instanceof Error ? error.message : "Unknown error"}. Please try again with a valid file.`;
    }
}

// Helper functions to generate random content
function getRandomTrait(): string {
    const traits = ["Analytical thinking with strong problem-solving abilities", "Creative approach to challenges with outside-the-box solutions", "Strong empathy and emotional intelligence", "Detail-oriented with excellent organizational skills", "Strategic long-term planning capabilities", "Adaptable and flexible in changing situations", "Independent thinking with self-directed motivation", "Collaborative mindset with team-oriented focus", "Logical decision-making based on objective analysis", "Intuitive understanding of complex situations", "Persistent determination when facing obstacles", "Curious and eager to learn new concepts"];
    return traits[Math.floor(Math.random() * traits.length)];
}

function getRandomCommunicationStyle(): string {
    const styles = ["You communicate directly and efficiently, preferring to get straight to the point without unnecessary details.", "Your communication style is thoughtful and measured, taking time to consider all angles before expressing your views.", "You tend to use metaphors and stories to illustrate your points, making complex ideas more accessible.", "Your communication is data-driven, often incorporating facts and evidence to support your arguments.", "You have a diplomatic communication style, carefully considering how your words might impact others.", "Your communication is energetic and enthusiastic, often inspiring others with your passion."];
    return styles[Math.floor(Math.random() * styles.length)];
}

function getRandomRecommendation(): string {
    const recommendations = ["The Psychology of Optimal Experience by Mihaly Csikszentmihalyi", "Thinking, Fast and Slow by Daniel Kahneman", "Quiet: The Power of Introverts in a World That Can't Stop Talking by Susan Cain", "Atomic Habits by James Clear", "The Four Tendencies by Gretchen Rubin", "Mindset: The New Psychology of Success by Carol S. Dweck", "The 7 Habits of Highly Effective People by Stephen Covey", "Emotional Intelligence by Daniel Goleman", "Man's Search for Meaning by Viktor E. Frankl", "Daring Greatly by Brené Brown", "The Power of Now by Eckhart Tolle", "Algorithms to Live By by Brian Christian and Tom Griffiths"];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
}
