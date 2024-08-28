import React, { useState } from "react"

import { postRequest } from "../utils/api"
import PaymentForm from "./PaymentForm"
import ListPaymentMethods from "./ListPaymentMethods"

import "./PaymentScreen.scss"

export default function PaymentScreen() {
    const [selectedMethod, setSelectedMethod] = useState({})
    const [paymentIntent, setPaymentIntent] = useState(null)
    const [activeScreen, setActiveScreen] = useState({
        prePayment: true,
        paymentMethods: false,
        paymentForm: false,
    })

    function handleSelectCard(pMethod) {
        setSelectedMethod(pMethod)
        createPaymentIntent(pMethod.id)
    }

    function createPaymentIntent(pSelectedPaymentMethodId) {
        postRequest('/payment/create', {
            paymentMethod: pSelectedPaymentMethodId
        })
            .then(resp => {
                setPaymentIntent(resp.data)
                setActiveScreen({paymentForm: false, paymentMethods: true})
                changeActiveScreen("paymentForm")
            })
            .catch(err => {
                console.log(err)
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
        <div className="wrapper">
            {activeScreen.prePayment && <button onClick={handleClickMakePayment}>Make Payment</button>}
            {activeScreen.paymentMethods && <ListPaymentMethods handleSelectCard={handleSelectCard} />}
            {activeScreen.paymentForm && paymentIntent && <PaymentForm paymentIntent={paymentIntent} paymentMethod={selectedMethod} />}
        </div>
    )
}