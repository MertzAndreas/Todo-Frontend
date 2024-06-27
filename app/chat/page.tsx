"use client"
// src/Chat.tsx

import React, {FormEvent, useEffect, useState} from "react";
import connection from "./signalrService";

type Message = {
    senderId: string;
    content: string;
    sentTime: string;
};

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    useEffect(() => {
        connection.on("ReceiveMessage", (senderId: string, content: string, sentTime: string) => {
            setMessages(prevMessages => [...prevMessages, { senderId, content, sentTime }]);
        });

        connection.on("MessageHistory", (messageHistory: Message[]) => {
            setMessages(messageHistory);
        });

        connection.start()
            .then((() => connection.invoke("RetrieveMessageHistory")))
            .catch(err => console.error(err));

        return () => {
            connection.off("ReceiveMessage");
            connection.off("MessageHistory");
        };
    }, []);

    const handleSendMessage = (event : FormEvent)  => {
        event.preventDefault();
        if (newMessage.trim()) {
            connection.invoke("PostMessage", newMessage)
                .then(() => setNewMessage(""))
                .catch(err => console.error(err));
        }

        if(connection.connectionId != null){
            const message : Message = { senderId: connection.connectionId, content: newMessage, sentTime: new Date().toISOString() };
            setMessages(prevMessages => [...prevMessages, message]);
        }
    };

    return (
        <div>
            <div>
                <h2>Message History</h2>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            {message.content} <em>{new Date(message.sentTime).toLocaleString()}</em>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <form onSubmit={handleSendMessage}>
                    <input
                        name={"messageInput"}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here"
                    />
                    <button type={"submit"}>Send</button>
                </form>

            </div>
        </div>
    );
};

export default Chat;
