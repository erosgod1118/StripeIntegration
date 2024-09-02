import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"

import { getRequest } from "../utils/api"
import { getCardImage } from "../utils/helpers"

import "./ListPaymentMethods.scss"

export default function ListPaymentMethods({ handleSelectCard }) {
    const [paymentMethods, setPaymentMethods] = useState(null)
    const navigate = useNavigate();

    function getPaymentMethods() {
        getRequest('/stripe/payment/methods?stripeCustomerId=' + localStorage.getItem('loggedInStripeCustomerId'))
            .then(resp => {
                setPaymentMethods(resp.data.data)
            })
            .catch(err => {
                if (err.status === 401) {
                    alert("Token Expired.")
                    navigate('/login')
                    return
                }

                console.log(err)
                alert("Getting payment methods failed.")
                navigate("/make-payment")
                return
            })
    }

    useEffect(getPaymentMethods)

    return (
        <div className="lpm-wrapper">
            <h3>Select your preferred payment method</h3>
            {paymentMethods && paymentMethods.map(method => (
            <div key={method.id} className="card" onClick={() => handleSelectCard(method)}>
                <div className="cardLogo">
                    <img src={getCardImage(method.card.brand)} alt="" />
                </div>
                <div className="details">
                    <p>
                        {method.card.brand} **** {method.card.last4}
                    </p>
                    <p>{method.billing_details.name}</p>
                </div>
                <div className="expire">
                    Expires{" "}
                    {format(new Date(`${method.card.exp_year}/${method.card.exp_month}/01`), "MM/yyyy")}
                </div>
            </div>
            ))}
        </div>
    )
}