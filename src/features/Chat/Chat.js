import React, { useState, useEffect } from "react";

import {
    useParams
} from "react-router-dom";
import { useMoralis } from "react-moralis";

import styles from './Chat.module.css';


function useChat(chatId) {
    const collection = "ChatMessage";
    const { Moralis } = useMoralis();
    const Message = Moralis.Object.extend(collection);
    let [messageList, setMessageList] = useState([]);
    let [messages, setMessags] = useState({});
    let [hasPermission, setHasPermission] = useState(false);
    let [groupName, setGroupName] = useState("");

    async function createMessage(chatId, text) {
        console.log("geri creating message ...")
        const message = new Message();
        message.set("chatId", chatId);
        message.set("text", text);
        return message.save();
    }

    useEffect(() => {
        Moralis.Cloud.run("getChatMesages", { chatId }).then((response) => {
            console.log("geri response", response);
            if (response.hasPermission) {
                const _messages = response.results;
                console.log("geri cloud messages", _messages);

                messages = _messages.reduce((acc, msg) => {
                    acc[msg.id] = msg;
                    return acc;
                }, {});

                let msgList = Object.values(messages);
                setMessags(messages);
                setMessageList(msgList);
            }

            setGroupName(response.groupName);
            setHasPermission(response.hasPermission);

        });
    }, [chatId]);

    useEffect(() => {
        let subscription = null;
        const query = new Moralis.Query(Message);
        query.equalTo("chatId", chatId);
        console.log("geri query", query);
        console.log("geri query json", query.toJSON());

        query.subscribe().then((s) => {
            subscription = s;
            console.log("geri have sbscribed to chat: ", chatId);

            subscription.on('create', (msg) => {
                console.log('geri object created', msg);
                messages[msg.id] = msg;
                let msgList = Object.values(messages);
                // msgList.sort((a, b) => {

                // });
                setMessags(messages);
                setMessageList(msgList);
            });
        });
        return () => {
            console.log("geri Unsubscribing ....");
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [chatId]);

    return { groupName, createMessage, messageList, hasPermission };
}

const Chat = () => {
    let { chatId } = useParams();
    let { groupName, createMessage, messageList, hasPermission } = useChat(chatId);
    let [messageText, setMessageText] = useState("Type your text");
    console.log("geri chat: ", chatId);
    console.log("geri messageList: ", messageList);
    console.log("geri messageList: ", messageList[0]);


    function handleMessageTextChange(event) {
        setMessageText(event.target.value);
    }

    function handlePost() {
        createMessage(chatId, messageText);
    }

    let chatContent = null;

    if (hasPermission) {
        chatContent = <div>
            <ul>{messageList.map((msg, idx) => {
                return <li key={idx} className={styles.message}>
                    <div>
                        <div>[{msg.createdAt.toISOString()}]</div>
                        <div>{msg.get("text")}</div>
                    </div>
                </li>
            })}</ul>
            <textarea className={styles.messageTextArea} onChange={handleMessageTextChange} value={messageText} />
            <button onClick={handlePost}>Post</button>
        </div>
    } else {
        chatContent = <div>Please purchase some ETH before you can access the chat</div>
    }

    return (
        <div className={styles.widget}>
            #{groupName}
            {chatContent}
        </div>
    );
};

export default Chat;
