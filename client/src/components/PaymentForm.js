import { useState } from "react"
import clsx from "clsx"
import { format } from "date-fns"
import { useStripe, CardCvcElement, useElements } from "@stripe/react-stripe-js"

import { postRequest } from "../utils/api"

export default function PaymentForm({ pPaymentMethod, pPaymentIntent }) {
    const stripe = useStripe()
    const elements = useElements()
    const [cvcError, setCvcError] = useState(null)
    const { card, billing_details } = pPaymentMethod

    const handleSubmit = async (pE) => {
        pE.preventDefault()
        stripe
            .createToken('cvc_update', elements.getElement(CardCvcElement))
            .then(result => {
                if (result.error) {
                    setCvcError(result.error.message)
                } else {
                    postRequest('/payment/confirm', {
                        paymentMethod: pPaymentMethod.id,
                        paymentIntent: pPaymentIntent.id,
                    })
                        .then(resp => {
                            console.log(resp.data)
                            handleServerResponse(resp.data)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function handleServerResponse(pResponse) {
        if (pResponse.error) {

        } else if (pResponse.next_action) {
            handleAction(pResponse)
        } else {
            alert("Payment Success")
            window.location.reload()
        }
    }

    function handleAction(pResponse) {
        stripe
            .handleCardAction(pResponse.client_secret)
                .then(result => {
                    if (result.error) {
                        console.log(result.error)
                    } else {
                        postRequest("/payment/confirm", {
                            paymentIntent: pPaymentIntent.id,
                            paymentMethod: pPaymentMethod.id,
                        })
                            .then(resp => {
                                handleServerResponse(resp.data)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
    }

    return (
        card && (
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="icon">
                            <img src={card.icon} alt="" />
                        </div>
                        <div className="row">
                            <label>Cardholder Name</label>
                            <p>{billing_details.name}</p>
                        </div>
                        <div className={clsx("row", "col")}>
                            <div className="cardNumber">
                                <label>Card Number</label>
                                <p>{`**** **** **** ${card.last4}`}</p>
                            </div>
                            <div className="expiry">
                                <label>Card Expiry</label>
                                <p>{format(new Date(`${card.exp_year}/${card.exp_month}/01`), "mm/yyyy")}</p>
                            </div>
                        </div>
                        <div className="row">
                            <label>Enter Cvc/Cvv </label>
                            <div className="cvcInput">
                                <CardCvcElement
                                    onChange={() => {
                                        setCvcError(null);
                                    }}
                                />
                            </div>
                            <p className="cvcError">{cvcError}</p>
                        </div>
                    </div>
                </form>
            </div>
        )
    )
}