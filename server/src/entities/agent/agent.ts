import { McpClient } from '../mcpClient/client';
import { ChatProcessor } from '../chat';

class AgentAI {
    private mcpClient: McpClient | undefined = undefined;
    private chatProcessor: ChatProcessor | undefined = undefined;
    private systemPrompt: string = '';

    constructor(systemPrompt: string) {
        this.systemPrompt = systemPrompt;
    }

    public init = async () => {
        this.mcpClient = new McpClient();
        await this.mcpClient.init();
        const tools = await this.mcpClient?.getTools();
        this.chatProcessor = new ChatProcessor(this.systemPrompt, tools ?? []);
    };

    public sendMessage = async (message: string) => {
        return this.chatProcessor?.sendMessage(message, this.mcpClient);
    };

    public clearMessages = () => {
        return this.chatProcessor?.clearMessages();
    };

    public subscribe = (callback: any) => {
        return this.chatProcessor?.subscribe(callback);
    };
}

export { AgentAI };
