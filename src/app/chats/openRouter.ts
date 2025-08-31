import { McpClient } from '../client';

class ChatProcessor {
    private systemPrompt: string = '';
    private tools: any[] = [];
    private messages: any[] = [];

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

        const messageLogElem = document.querySelector('#messages-log');

        if (messageLogElem) {
            let outerString = '';
            this.messages.forEach((message) => {
                outerString += `<p>${message.content}</p>`;
            });
            messageLogElem.outerHTML = `<div id='messages-log'>${outerString}</div>`;
        }
    };

    public fetchToModel = async () => {
        const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer token example',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-4-maverick:free',
                    messages: this.messages,
                    tools: this.tools,
                }),
            }
        );

        const result = await response.json();

        return result.choices[0];
    };

    public sendMessage = async (
        message: string,
        client: McpClient | undefined
    ) => {
        this.addNewMessage({
            role: 'user',
            content: message,
        });

        const result = await this.fetchToModel();
        this.addNewMessage(result.message);

        if (result.message.tool_calls) {
            for (const tool of result.message.tool_calls) {
                const output = await client?.callTool(
                    tool.function.name,
                    JSON.parse(tool.function.arguments)
                );

                if (output) {
                    const arrayResult = output.content as any[];
                    this.addNewMessage({
                        role: 'system',
                        content: arrayResult[0].text,
                    });
                }
            }

            const finalResult = await this.fetchToModel();
            this.addNewMessage(finalResult.message);

            return finalResult.message.content;
        } else {
            this.addNewMessage(result.message);
        }
    };
}

export { ChatProcessor };
