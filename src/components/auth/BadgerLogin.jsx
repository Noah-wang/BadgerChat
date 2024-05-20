import React, { useRef, useContext } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogin() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const handleSubmit = (event) => {
        event.preventDefault();


        const username = usernameRef.current.value;
        const password = passwordRef.current.value;


        if (!username || !password) {
            alert("You must provide both a username and password!");
            return;
        }


        fetch('https://cs571.org/api/s24/hw6/login', {
            method: 'POST',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })

        })
            .then(data => {
                if (data.status === 401) {
                    alert("Incorrect username or password!");
                } else {
                    alert("Login was successful!");
                    navigate('/');
                    setLoginStatus(true);
                    sessionStorage.setItem("isLoggedIn", true);
                    sessionStorage.setItem("loggedInUser", data.user.username);
                    
                }



            });
    };
    // TODO Create the login component.

    return <>
        <h1>Login</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group >
                <Form.Label htmlFor='Username'>Username</Form.Label>
                <Form.Control
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    ref={usernameRef}
                />
            </Form.Group>

            <Form.Group >
                <Form.Label htmlFor='password'>Password</Form.Label>
                <Form.Control
                    id="password"
                    type="password"
                    placeholder="Password"
                    ref={passwordRef}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    </>
}
