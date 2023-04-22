import React from 'react'
import {useState} from 'react'
import {Link} from "react-router-dom"
import styles from '../styles/Main.module.css'

const FIELDS = {
  NAME: "name",
  ROOM: "room"
}

const Main = () => {

  const { NAME, ROOM } = FIELDS;
  const [values, setValues] = useState({ [NAME]: "", [ROOM]: "" });
  
  const handlChange = ({target: {value, name}}) => {
    setValues({...values, [name]: value})
  }

  const handlClick = (e) => {
    const isDasabled = Object.values(values).some((value) => !value)
    if(isDasabled) e.preventDefault()
  }
  console.log(values)

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>

        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              name="name"
              value={values[NAME]}
              placeholder='Username'
              className={styles.input}
              onChange={handlChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.group}>
            <input
              type="text"
              name="room"
              value={values[ROOM]}
              placeholder='Room'
              className={styles.input}
              onChange={handlChange}
              autoComplete="off"
              required
            />
          </div>
          <Link
            className={styles.group}
            onClick={handlClick}
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}>
            <button type="submit" className={styles.button}>
              Sign In
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Main