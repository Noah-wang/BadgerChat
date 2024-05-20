import React, { useEffect, useState, useContext, useRef } from "react"
import { Container, Row, Col, Pagination, Form, Button } from 'react-bootstrap';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext"
import BadgerMessage from "./BadgerMessage"


export default function BadgerChatroom(props) {
    const user = useContext(BadgerLoginStatusContext);
    const startStatus = Boolean(sessionStorage.getItem("isLoggedIn"));
    const [loginStatus, setLoginStatus] = useState(startStatus);
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const title = useRef();
    const content = useRef();

    const loadMessages = () => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${currentPage}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    const createPost = e => {
        e.preventDefault();

        if (!(title && content)) {
            alert("You must provide both a title and content!");
        } else {
            fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${currentPage}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title.current.value,
                    content: content.current.value
                })
            })
                .then(res => {
                    if (res.status === 401) {
                        throw new Error("You must be logged in to post!");
                    }
                    alert("Successfully posted!");
                    loadMessages();
                })
                .catch(err => alert(err.message));

            title.current.value = '';
            content.current.value = '';
        }
    }

    const deletePost = id => {
        fetch(`https://cs571.org/api/s24/hw6/messages?id=${id}`, {
            method: "DELETE",
            credentials: "include",

            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
        }).then((res) => {
            if (res.status === 200) {
                alert("Successfully deleted the post!")
                loadMessages()
            }
        })
    }



    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props, currentPage]);

    return <Container>
        <h1>{props.name} Chatroom</h1>
        {

            loginStatus ? (
                <Form onSubmit={createPost}>
                    <Form.Group >
                        <Form.Label htmlFor="title">Title</Form.Label>
                        <Form.Control type="text" ref={title} id="title" placeholder="Enter post title" />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label htmlFor="content">Content</Form.Label>
                        <Form.Control rows={3} ref={content} id="content" placeholder="Enter post content" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create Post
                    </Button>
                </Form>
            ) : (
                <Alert variant="info">You must be logged in to post!</Alert>
            )}

        <hr />
        {
            messages.length > 0 ? (
                <Row>
                    {messages.map((msg) => (
                        <Col xs={12} sm={6} md={6} lg={4} xl={4} key={msg.id}>
                            <BadgerMessage
                                title={msg.title}
                                poster={msg.poster}
                                content={msg.content}
                                created={msg.created}
                                user={user}
                                deletePost={deletePost}
                                id={msg.id}
                            />
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>There are no messages on this page yet!</p>
            )
        }
        <Pagination className="current-page">
            {[1, 2, 3, 4].map(page => (
                <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    </Container>
}
