import React, { useState, useEffect } from "react"

import UserService from "../services/user-service"
import { Navigate, useNavigate } from "react-router-dom";

export default function Land() {
    const [content, setContent] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        UserService.getPublicContent().then(
            (response) => {
                setContent(response.data);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();

                setContent(_content);
            }
        );
    }, [])

    return (
        <div className="land">
            <h1 className="title">Welcome to Trip Planner!</h1>
            <img className="land-img" src="./icon.svg" alt="icon" />
            <p>Please log in / sign up first</p>
            <div className="land-btn" onClick={() => navigate('/login')}>Log in</div>
            <div className="land-btn" onClick={() => navigate('/signup')}>Sign up</div>
        </div>
    )
}
