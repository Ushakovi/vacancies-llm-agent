import { McpClient } from '../mcpClient';

class ChatProcessor {
    private llmUrl: string = 'http://localhost:11434/api/chat';
    private systemPrompt: string = '';
    private tools: any[] = [];
    private messages: any[] = [];
    private subscribers: any[] = [];

    constructor(systemPrompt: string, tools: any[]) {
        this.systemPrompt = systemPrompt;

        this.messages.push({
            role: 'user',
            content: this.systemPrompt,
        });

        this.tools = tools.map((tool) => ({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema,
            },
        }));
    }

    public addNewMessage = (message: any) => {
        this.messages.push(message);

        this.subscribers.forEach((subscriber) => {
            subscriber(message);
        });
    };

    public clearMessages = () => {
        this.messages = [];

        this.messages.push({
            role: 'user',
            content: this.systemPrompt,
        });
    };

    public subscribe = (callback: any) => {
        this.subscribers.push(callback);
    };

    public fetchToModel = async () => {
        const response = await fetch(this.llmUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen3:8b',
                messages: this.messages,
                tools: this.tools,
                stream: false,
            }),
        });

        const result = await response.json();

        return result;
    };

    private answerWithTools = async (
        answer: any,
        client: McpClient | undefined
    ): Promise<any> => {
        for (const tool of answer.message.tool_calls) {
            const output = await client?.callTool(
                tool.function.name,
                tool.function.arguments
            );

            if (output) {
                const arrayResult = output.content as any[];
                this.addNewMessage({
                    role: 'tool',
                    content: arrayResult[0].text,
                });
            }
        }

        const nextAnswer = await this.fetchToModel();
        this.addNewMessage(nextAnswer.message);

        if (nextAnswer.message.tool_calls) {
            return this.answerWithTools(nextAnswer, client);
        }

        return nextAnswer;
    };

    public sendMessage = async (
        message: string,
        client: McpClient | undefined
    ) => {
        this.addNewMessage({
            role: 'user',
            content: message,
        });

        const answer = await this.fetchToModel();
        this.addNewMessage(answer.message);

        if (answer.message.tool_calls) {
            const finalResult = await this.answerWithTools(answer, client);

            return finalResult.message.content;
        }

        return answer.message.content;
    };
}

export { ChatProcessor };
