const dotenv = require("dotenv");
const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    rl.question("Pregunta: ", async (question) => {
        const prompt = "Eres un abogado asistente experto en las leyes de Argentina, la Constitución Nacional y los procesos legales. Solo responderás preguntas relacionadas con el ámbito legal. Pregunta: " + question;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // Mostrar la respuesta letra por letra
        for (let i = 0; i < text.length; i++) {
            process.stdout.write(text.charAt(i));
            await new Promise(resolve => setTimeout(resolve, 50)); // Controla la velocidad de la escritura
        }

        console.log();

        // Contar los tokens usados
        const { totalTokens } = await model.countTokens(prompt);
        console.log(`Total tokens used: ${totalTokens}`);

        rl.close();
    });
}

run().catch(console.error);

