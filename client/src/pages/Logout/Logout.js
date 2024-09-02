import React, { startTransition  } from "react"
import { useNavigate } from "react-router-dom"

import "./Logout.scss"

export default function Login() {
    const navigate = useNavigate();

    function handleLogout(pE) {
        pE.preventDefault()
        
        localStorage.removeItem('token')
        localStorage.removeItem('loggedInStripeCustomerId')

        alert("Logged out successfully!")

        startTransition(() => {
            navigate("/login")
        })
    }

    return (
        <div className="logout-wrapper">
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}