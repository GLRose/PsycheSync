"use server";

import type {PersonalityAnalysis} from "./analyzer";

export async function generatePersonalityReport(analysis: PersonalityAnalysis): Promise<string> {
 
    const mbtiDescriptions: Record<string, string> = {
        INTJ: "The Architect - strategic, innovative, and private",
        INTP: "The Logician - innovative, logical, and contemplative",
        ENTJ: "The Commander - efficient, energetic, and strategic",
        ENTP: "The Debater - innovative, alert, and outspoken",
        INFJ: "The Advocate - insightful, principled, and purposeful",
        INFP: "The Mediator - idealistic, compassionate, and creative",
        ENFJ: "The Protagonist - charismatic, inspiring, and supportive",
        ENFP: "The Campaigner - enthusiastic, creative, and sociable",
        ISTJ: "The Logistician - practical, fact-minded, and reliable",
        ISFJ: "The Defender - warm, dedicated, and supportive",
        ESTJ: "The Executive - efficient, outgoing, and analytical",
        ESFJ: "The Consul - caring, social, and organized",
        ISTP: "The Virtuoso - versatile, practical, and spontaneous",
        ISFP: "The Adventurer - flexible, charming, and artistic",
        ESTP: "The Entrepreneur - energetic, perceptive, and bold",
        ESFP: "The Entertainer - spontaneous, energetic, and enthusiastic",
    };

    const mbtiDescription = mbtiDescriptions[analysis.mbtiType] || `The ${analysis.mbtiType}`;

    // Format the Big Five traits
    const formatTraitLevel = (score: number): string => {
        if (score >= 80) return "very high";
        if (score >= 60) return "high";
        if (score >= 40) return "moderate";
        if (score >= 20) return "low";
        return "very low";
    };

    const traitsDescription = `
• Openness: ${formatTraitLevel(analysis.traits.openness)} (${analysis.traits.openness}/100)
• Conscientiousness: ${formatTraitLevel(analysis.traits.conscientiousness)} (${analysis.traits.conscientiousness}/100)
• Extraversion: ${formatTraitLevel(analysis.traits.extraversion)} (${analysis.traits.extraversion}/100)
• Agreeableness: ${formatTraitLevel(analysis.traits.agreeableness)} (${analysis.traits.agreeableness}/100)
• Neuroticism: ${formatTraitLevel(analysis.traits.neuroticism)} (${analysis.traits.neuroticism}/100)
`;

// Build the full report
    return `
Based on the analysis of your conversation data, your personality type is:

${analysis.mbtiType} - ${mbtiDescription}

Big Five Personality Traits:${traitsDescription}

Communication Style:
${analysis.communicationStyle}

Key Strengths:
${analysis.strengths.map(s => `• ${s}`).join("\n")}

Potential Challenges:
${analysis.challenges.map(c => `• ${c}`).join("\n")}

You are most compatible with: ${analysis.compatibleTypes.join(" and ")}

Recommended Content:
${analysis.recommendedContent.map(r => `• ${r}`).join("\n")}

Note: This analysis is based on the patterns detected in your conversation data. As more users join PersonAi, your personality profile will become more refined and accurate.
`;
}
