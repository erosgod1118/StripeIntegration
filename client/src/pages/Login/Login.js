import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import "./Login.scss"

import { postRequest } from "../../utils/api"

export default function Login() {
    const [formData, setFormData] = useState({})
    const navigate = useNavigate();

    function handleFormChange(e) {
        const { name, value } = e.target

        setFormData((prev) => {
            return { ...prev, [name]: value }
        })
    }

    function handleFormSubmit(e) {
        e.preventDefault()
        postRequest("/user/login", formData)
            .then((resp) => {
                localStorage.setItem('token', resp.data.token)
                localStorage.setItem('loggedInStripeCustomerId', resp.data.stripeCustomerId)

                navigate('/make-payment')
            })
            .catch((err) => {
                console.log(err)
                alert("User login failed. Please try again.")
                navigate('/login')
            })
    }

    return (
        <div className="wrapper">
            <form onChange={handleFormChange} onSubmit={handleFormSubmit}>
                <div className="title">Log In</div>
                <div className="row">
                    <label>Email</label>
                    <input name="email" type="email" />
                </div>
                <div className="row">
                    <label>Password</label>
                    <input name="password" type="password" />
                </div>
                <div className="btnContainer">
                    <button>Login</button>
                </div>
            </form>
        </div>
    )
}