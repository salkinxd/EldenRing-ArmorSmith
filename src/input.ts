import { createInterface } from 'readline';
import { RollType } from './types';

// User Input
const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

export function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

export async function getNumberInput(question: string): Promise<number> {
    const input = await askQuestion(question);
    return parseFloat(input);
}

export async function getRollTypeInput(): Promise<RollType> {
    const rollTypeStr = await askQuestion("Enter your desired roll type (light, medium, heavy): ");
    switch (rollTypeStr.toLowerCase()) {
        case "light":
            return RollType.Light;
        case "medium":
            return RollType.Medium;
        case "heavy":
            return RollType.Heavy;
        default:
            console.log("Invalid roll type. Defaulting to medium.");
            return RollType.Medium;
    }
}

export async function getStringArrayInput(question: string): Promise<string[]> {
    const input = await askQuestion(question);
    return input.toLowerCase().split(" ");
}