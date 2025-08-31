import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

class McpClient {
    private client: Client | undefined = undefined;
    private serverUrl: string = 'http://localhost:8080/mcp';

    constructor() {}

    public init = async () => {
        const baseUrl = new URL(this.serverUrl);

        this.client = new Client({
            name: 'streamable-http-client',
            version: '1.0.0',
        });

        const transport = new StreamableHTTPClientTransport(new URL(baseUrl));

        await this.client.connect(transport);

        console.log('Connected using Streamable HTTP transport');
    };

    public getTools = async () => {
        const tools = (await this.client?.listTools())?.tools;
        return tools;
    };

    public callTool = async (
        toolName: string,
        toolArgs: Record<string, unknown>
    ) => {
        if (this.client) {
            const result = await this.client.callTool({
                name: toolName,
                arguments: toolArgs,
            });

            return result;
        }
    };
}

export { McpClient };
