import { useState } from 'react';
import * as styles from './app.module.css';

const App = () => {
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<
        { role: string; message: string }[]
    >([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = 'http://localhost:3001/messages';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatInput(event.target.value);
    };

    const handleClear = async () => {
        setLoading(true);
        try {
            await fetch(`${apiUrl}/clear`, {
                method: 'GET',
            });

            setMessages([]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setLoading(true);

            setMessages((prev) => [
                ...prev,
                { role: 'Пользователь', message: chatInput },
            ]);

            const res = await fetch(`${apiUrl}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: chatInput }),
            });

            const { answer } = await res.json();

            setMessages((prev) => [...prev, { role: 'LLM', message: answer }]);
            setChatInput('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                messages.length > 0 && (
                    <div className={styles.messageWrapper}>
                        {messages.map(({ role, message }, i) => (
                            <p key={i}>
                                <b>{role}:</b> {message}
                            </p>
                        ))}
                    </div>
                )
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
