import { AgentAI } from './app/agent';

const agent = new AgentAI(
    'Ты ассистент по подбору вакансий. Разговариваешь только на русском языке.'
);
await agent.init();

await agent.sendMessage('Дай мне все senior frontend вакансии');
