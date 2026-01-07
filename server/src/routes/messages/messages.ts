import { AgentAI } from '../../entities/agent';
import express from 'express';

const router = express.Router();
let agentInstance: AgentAI | null = null;

const initAgent = async () => {
    agentInstance = new AgentAI(
        'Ты ассистент по подбору вакансий. Разговариваешь только на русском языке. Ответ возвращаешь только в виде текста, без верстки.'
    );

    await agentInstance.init();
};

router.get('/clear', (req, res) => {
    agentInstance?.clearMessages();

    res.send(JSON.stringify({ answer: `New chat was created` }));
});

router.post('/send', async (req, res) => {
    if (!agentInstance) await initAgent();

    const response = await agentInstance?.sendMessage(req.body.message);

    res.send(JSON.stringify({ answer: response }));
});

export default router;
