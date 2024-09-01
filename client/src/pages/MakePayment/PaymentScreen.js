import React, { useState } from "react"

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

    function handleSelectCard(pMethod) {
        setSelectedMethod(pMethod)
        createPaymentIntent(pMethod.id)
    }

    function createPaymentIntent(pSelectedPaymentMethod) {
        console.log("Selected Payment Method: ", pSelectedPaymentMethod)

        postRequest('/stripe/payment/create', {
            paymentMethod: pSelectedPaymentMethod.id
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
        <div className="mp-wrapper">
            {activeScreen.prePayment && <button onClick={handleClickMakePayment}>Make Payment</button>}
            {activeScreen.paymentMethods && <ListPaymentMethods handleSelectCard={handleSelectCard} />}
            {activeScreen.paymentForm && paymentIntent && <PaymentForm paymentIntent={paymentIntent} paymentMethod={selectedMethod} />}
        </div>
    )
}