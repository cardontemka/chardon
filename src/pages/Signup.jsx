import axios from "axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles/Auth.module.css"

export const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');
    const navigate = useNavigate();

    const submit = () => {
        axios
            .post('http://192.168.1.29:8080/signup', {
                username: username,
                password: password,
            })
            .then((res) => {
                console.log(res)
                window.localStorage.setItem('userId', res.data._id);
                navigate('/')
            })
            .catch((error) => {
                console.log(error)
                if (error.response) {
                    setAlert(error.response.data);
                }
            })
    }

    return (
        <div className={styles.contain}>
            <h1>Sign up</h1>
            <span className={styles.alert}>{alert}</span>
            <input
                className={styles.input}
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                type="text"
            />
            <input
                className={styles.input}
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
            />
            <button className={styles.submit} onClick={submit} onTouchStart={submit}>Submit</button>
            <Link to='/login' className={styles.link}>
                <p>Already have account</p>
            </Link>
            <span className={styles.text}>cardon is carton not cardon</span>
        </div>
    )
}