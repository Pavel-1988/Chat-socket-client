import React, { useEffect } from 'react'
import { useState } from 'react'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom';
import EmojiPicker from "emoji-picker-react"

import icon from "../images/icon.svg"
import styles from "../styles/Chat.module.css"
import Messages from './Messages';

const socket = io.connect("http://localhost:5000")

const Chat = () => {

  const { search } = useLocation()
  console.log(search)
  const [params, setParams] = useState({room:"", user:""});
  const [state, setState] = useState([])
  const [message, setMessage] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search))
    console.log(searchParams)
    setParams(searchParams)
    socket.emit('join', searchParams)
  },[search])

  console.log(params)

  useEffect(() => {
  socket.on('message', ({ data }) => {
      setState((_state) => [..._state,data])
      console.log(data)
    });
  }, [])
  
  useEffect(() => {
    socket.on('room', ({ data: {users} }) => {
      setUsers(users.length)
    });
  },[])


  const leftRoom = () => {
    socket.emit('leftRoom', { params });
    navigate("/")
   }

  const handlChange = ({ target: { value } }) => {
    setMessage(value);
  }

  const handlSubmit = (e) => {
    e.preventDefault()

    if (!message) return;

    socket.emit('sendMessage', { message, params });
    setMessage("")
  }

  const EmojiClick = ({emoji}) => setMessage(`${message} ${emoji}`)

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>
          Name room: " {params.room} "
        </div>
        <div className={styles.users}>
          {users} users in this room
        </div>
        <button className={styles.left} onClick = {leftRoom}>
          Left the Room
        </button>
      </div>
      <div className={styles.messages}>
      < Messages messages={state} name={params.name} />
      </div>
     
      <form className={styles.form} onSubmit={handlSubmit}>
         <div className={styles.input}>
            <input
              type="text"
              name="message"
              value={message}
              placeholder='Write here'
              onChange={handlChange}
              autoComplete="off"
              required
            />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="" onClick={() => setOpen(!isOpen)} fill="#ffffff" />

          {isOpen && (
             <div className={styles.emojies}>
            <EmojiPicker onEmojiClick={EmojiClick}/>
          </div>
          )}
        </div>
        <div className={styles.button}>
          <input type="submit" onSubmit={handlSubmit} value="Send a message" />
        </div>
      </form>
    </div>
  )
}

export default Chat