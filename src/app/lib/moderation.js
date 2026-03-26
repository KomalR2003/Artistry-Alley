import OpenAI from 'openai';
import vader from 'vader-sentiment';
import Sentiment from 'sentiment';

export async function checkContentToxicity(text) {
    if (!text) return { isToxic: false, status: 'approved' };

    // 1. Local Sentiment Analysis Check as a fallback/first line of defense
    try {
        const sentimentChecker = new Sentiment();
        const sentimentResult = sentimentChecker.analyze(text);
        if (sentimentResult.score < 0 || sentimentResult.comparative < 0) {
            return { isToxic: true, status: 'hidden', categories: { negative_sentiment: true } };
        }

        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
        if (intensity.compound <= -0.05) {
            return { isToxic: true, status: 'hidden', categories: { negative_sentiment: true } };
        }
    } catch (err) {
        console.error('Error running local sentiment analysis:', err);
    }

    // 2. Groq LLM Moderation (Free & Fast)
    if (!process.env.GROQ_API_KEY) {
        console.warn('GROQ_API_KEY is not set. Using local sentiment only.');
        return { isToxic: false, status: 'approved' };
    }

    try {
        const groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });

        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "system",
                    content: `
You are a strict comment moderation system.
Classify the comment into exactly one of these categories:
- positive
- neutral
- negative
- toxic

Respond ONLY with the one single word. Nothing else.
                    `,
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            temperature: 0,
            max_tokens: 10,
        });

        const classification = response.choices[0].message.content.trim().toLowerCase();
        console.log(`Groq LLM classification for "${text}":`, classification);

        if (classification.includes('negative') || classification.includes('toxic')) {
            return { 
                isToxic: true, 
                status: 'hidden', 
                categories: { [classification]: true },
                reason: classification
            };
        }

        return { isToxic: false, status: 'approved', reason: classification };

    } catch (err) {
        console.error('Error running Groq LLM analysis:', err);
        return { isToxic: false, status: 'approved', error: err.message };
    }
}
