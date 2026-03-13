import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

class McpClient {
    private client: Client | undefined = undefined;
    private serverUrl: string = 'http://localhost:8081/mcp';

    constructor() {}

    public init = async () => {
        try {
            const baseUrl = new URL(this.serverUrl);

            this.client = new Client({
                name: 'streamable-http-client',
                version: '1.0.0',
            });

            const transport = new StreamableHTTPClientTransport(new URL(baseUrl));

            await this.client.connect(transport);

            console.log('Connected using Streamable HTTP transport');
        } catch (error) {
            console.error('Failed to connect to MCP server:', error);
            throw error;
        }
    };

    public getTools = async () => {
        if (!this.client) {
            throw new Error('MCP client not initialized');
        }
        const tools = (await this.client.listTools())?.tools;
        return tools;
    };

    public callTool = async (
        toolName: string,
        toolArgs: Record<string, unknown>
    ) => {
        if (!this.client) {
            throw new Error('MCP client not initialized');
        }
        const result = await this.client.callTool({
            name: toolName,
            arguments: toolArgs,
        });

        return result;
    };
}

export { McpClient };
