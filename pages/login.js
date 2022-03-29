import { Google } from '@mui/icons-material';
import { Button } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import styled from 'styled-components';
import { auth, provider } from '../firebase'

const login = () => {
    const loginWithGoogle = () => {
        signInWithPopup(auth, provider);
    }
  return (
    <Container>
        <Login>
            <Button style={{ color: 'gray'}} startIcon={<Google />} onClick={loginWithGoogle}>
                Login with google    
            </Button>
        </Login>
    </Container>
  )
}

export default login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: rgb(0,150,136);
    width: 100vw;
`

const Login = styled.div`
    padding: 30px;
    display: flex;
    gap: 20px;
    background-color: white;
    border-radius: 15px;
`