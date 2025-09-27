import { useEffect, useState } from 'react';
import * as styles from './app.module.css';
import { AgentAI } from '../entities/agent';

const App = () => {
    const [chatInput, setChatInput] = useState('');
    const [agent, setAgent] = useState<AgentAI | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const initAgent = async () => {
            const agentInstance = new AgentAI(
                'Ты ассистент по подбору вакансий. Разговариваешь только на русском языке.'
            );

            await agentInstance.init();

            agentInstance.subscribe((message: any) =>
                setMessages((prev) => [...prev, message])
            );
            setAgent(agentInstance);
        };

        initAgent();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatInput(event.target.value);
    };

    const handleClear = () => {
        agent?.clearMessages();
        setMessages([]);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setChatInput('');

        await agent?.sendMessage(chatInput);
    };

    return (
        <>
            {messages.length > 0 && (
                <div className={styles.messageWrapper}>
                    {messages.map(
                        ({ role, content }, i) =>
                            content.length > 0 && (
                                <p key={i}>
                                    <b>{role}:</b> {content}
                                </p>
                            )
                    )}
                </div>
            )}
            <form className={styles.chatWrapper} onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='chat'
                    id='chat'
                    placeholder='Сообщение агенту'
                    className={styles.chatInput}
                    value={chatInput}
                    onChange={handleChange}
                />
                <button type='submit' className={styles.chatButton}>
                    Отправить
                </button>
                <button
                    type='button'
                    className={styles.chatButton}
                    onClick={handleClear}
                >
                    Очистить чат
                </button>
            </form>
        </>
    );
};

export { App };
