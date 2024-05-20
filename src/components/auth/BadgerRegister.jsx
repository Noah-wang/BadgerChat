import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

export default function BadgerRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();


        if (!username || !password) {
            alert("You must provide both a username and password!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Your passwords do not match!");
            return;
        }


        fetch('https://cs571.org/api/s24/hw6/register', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        })
            .then(data => {
                if (data.status === 409) {
                    alert("That username has already been taken!");
                } else {
                    alert("Registration was successful!");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return <>
        <h1>Register</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label htmlFor='username'>Username</Form.Label>
                <Form.Control
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                />
            </Form.Group>

            <Form.Group>
                <Form.Label htmlFor='password'>Password</Form.Label>
                <Form.Control
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />
            </Form.Group>

            <Form.Group >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    id="password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    </>
}
