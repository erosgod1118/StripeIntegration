import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { postRequest } from "../../utils/api"
import PaymentForm from "../../components/PaymentForm"
import ListPaymentMethods from "../../components/ListPaymentMethods"

import "./PaymentScreen.scss"

export default function PaymentScreen() {
    const [selectedMethod, setSelectedMethod] = useState({})
    const [paymentIntent, setPaymentIntent] = useState(null)
    const [activeScreen, setActiveScreen] = useState({
        prePayment: true,
        paymentMethods: false,
        paymentForm: false,
    })
    const navigate = useNavigate()

    function handleSelectCard(pMethod) {
        setSelectedMethod(pMethod)
        createPaymentIntent(pMethod)
    }

    function createPaymentIntent(pSelectedPaymentMethod) {
        postRequest('/stripe/payment/create', {
            paymentMethodId: pSelectedPaymentMethod.id,
            stripeCustomerId: localStorage.getItem("loggedInStripeCustomerId"),
        })
            .then(resp => {
                setPaymentIntent(resp.data)
                setActiveScreen({paymentForm: false, paymentMethods: true})
                changeActiveScreen("paymentForm")
            })
            .catch(err => {
                if (err.status === 401) {
                    alert("Token Expired.")
                    navigate("/login")
                }

                console.log(err)
                alert("Create payment failed.")
                navigate("/make-payment")
            })
    }

    function changeActiveScreen(pScreen) {
        let toUpdate = { prePayment: false, paymentMethods: false, paymentForm: false }
        toUpdate[pScreen] = true
        setActiveScreen(toUpdate)
    }

    function handleClickMakePayment() {
        changeActiveScreen("paymentMethods")
    }

    return (
        <div className="mp-wrapper">
            {activeScreen.prePayment && <button onClick={handleClickMakePayment}>Make Payment</button>}
            {activeScreen.paymentMethods && <ListPaymentMethods handleSelectCard={handleSelectCard} />}
            {activeScreen.paymentForm && paymentIntent && <PaymentForm pPaymentIntent={paymentIntent} pPaymentMethod={selectedMethod} />}
        </div>
    )
}