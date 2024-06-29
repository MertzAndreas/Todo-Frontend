"use client"
import React, {FormEvent, useEffect, useState} from "react";
import {useSignalR} from "@/app/SignalRContext";

type Message = {
    senderId: string;
    content: string;
    sentTime: string;
};

const Chat: React.FC = () => {
    const { connection } = useSignalR();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");


    useEffect(() => {
        if(connection){
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
        }
    }, [connection]);

    const handleSendMessage = (event : FormEvent)  => {
        event.preventDefault();
        if (newMessage.trim() && connection) {
            connection.invoke("PostMessage", newMessage)
                .then(() => setNewMessage(""))
                .catch(err => console.error(err));
        }
    };

    if (!connection) {
        return <div>No connection</div>;
    }

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
