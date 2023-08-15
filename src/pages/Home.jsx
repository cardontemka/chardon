import axios from "axios";
import { useEffect, useRef } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import styles from "./styles/Home.module.css"

export const Home = () => {
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [log, setLog] = useState(false);
    const userId = window.localStorage.getItem('userId')
    const navigate = useNavigate();
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (userId) {
            axios
                .get(`http://192.168.1.29:8080/user/${userId}`)
                .then((res) => {
                    setUsername(res.data.username)
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            console.log(userId)
            navigate('/signup')
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
        axios
            .get(`http://192.168.1.29:8080/chats`)
            .then((res) => {
                setChats(res.data)
                console.log(chats)
            })
            .catch((error) => {
                console.log(error)
            })

        if (chats.length >= 100) {
            axios
                .delete(`http://192.168.1.29:8080/chat/${chats[0]._id}`)
                .catch(error => console.log(error))
        }
    }, [chats])

    const sendMessage = () => {
        if (!message) return
        axios
            .post("http://192.168.1.29:8080/chats", {
                username: username,
                message: message,
            })
            .then((res) => {
                setMessage('')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleKeyCode = (event) => {
        if (event.keyCode === 13) {
            sendMessage()
        }
    }

    const logOut = () => {
        window.localStorage.removeItem('userId')
        navigate('/signup')
    }

    const changeLogOut = () => {
        setLog(true)
        setTimeout(() => {
            setLog(false)
        }, 3000);
    }

    return (
        <div className={styles.contain}>
            {log ?
                <span className={styles.option} onClick={logOut}>
                    Log out
                </span>
                :
                <span className={styles.option} onClick={changeLogOut}>{username}</span>
            }
            <div className={styles.chatsContain}>
                {chats.map((item, index) => {
                    if (item.username === username) {
                        return (
                            <div className={styles.myChatContain} key={index}>
                                <p className={styles.chatName}>{item.username}</p>
                                <p className={styles.chat}>{item.message}</p>
                            </div>
                        )
                    } else {
                        return (
                            <div className={styles.chatContain} key={index}>
                                <p className={styles.chatName}>{item.username}</p>
                                <p className={styles.chat}>{item.message}</p>
                            </div>
                        )
                    }
                })}
                <div ref={messagesEndRef} />
            </div>
            <input
                className={styles.message}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyCode}
                type="text"
                placeholder="Cardondotsgooy"
            />
            {message && <button className={styles.sendButton} onClick={sendMessage} >send</button>}
        </div>
    )
}