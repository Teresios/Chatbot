"use client";
import { useState } from 'react';

export default function ChatComponents() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            result += decoder.decode(value);
            const parsedResult = parseStreamedResponse(result);
            setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: parsedResult }]);
        }

        setInput('');
    };

    const parseStreamedResponse = (response: string) => {
        const lines = response.split('\n').filter(line => line.trim() !== '');
        const messages = lines.map(line => {
            const data = line.replace('data: ', '');
            try {
                return JSON.parse(data).choices[0].delta.content || '';
            } catch {
                return '';
            }
        });
        return messages.join('');
    };

    return (
        <div>
            <div>
                <h3 className="text-lg font-semibold mt-2">Chatty</h3>
                <p>I am a robot created by Teresios Bundi the Guru himself</p>
            </div>
            <form className="mt-12" onSubmit={handleSubmit}>
                <p>User Message</p>
                <textarea
                    className="mt-2 w-full bg-slate-600 p-2"
                    placeholder={"Enter your message here"}
                    value={input}
                    onChange={handleInputChange}
                />
                <button className="mt-2 bg-blue-500 p-2 text-white" type="submit">
                    Send message
                </button>
            </form>
            <div className="mt-4">
                <h4 className="text-lg font-semibold">Messages:</h4>
                {messages.map((msg, index) => (
                    <div key={index} className="mt-2">
                        <p><strong>{msg.role}:</strong> {msg.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}