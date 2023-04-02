import React from 'react'
import { auth } from '../firebase/init'
import { signInWithEmailAndPassword } from "firebase/auth";
import { TextField, Button } from '@mui/material';
import styled from '@emotion/styled';


function SignIn({ setIsLoggedIn }) {

    const [input, setInput] = React.useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = React.useState(false)

    const handleInput = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }
    const handleSignIn = () => {
        setLoading(true)
        signInWithEmailAndPassword(auth, input.email, input.password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            setLoading(false)
            setIsLoggedIn(true)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            setLoading(false)
        });
    }
  return (
    <Wrapper>
        <h1>Please Sign in To Admin Panel</h1>
        <TextField 
            name="email"
            type="email"
            placeholder="abc@example.com"
            label="Email"
            value={input.email}
            onChange={handleInput}
        />
        <TextField 
            name="password"
            type="password"
            label="Password"
            value={input.password}
            onChange={handleInput}
        />
        <div>
            <Button variant="contained" onClick={handleSignIn} disabled={loading}>Login</Button>
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width: 100%;
    height: 95vh;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
`

export default SignIn