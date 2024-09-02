import { useState } from "react"
import clsx from "clsx"
import { format } from "date-fns"
import { useStripe, CardCvcElement, useElements } from "@stripe/react-stripe-js"
import { useNavigate } from "react-router-dom"

import { postRequest } from "../utils/api"

import "./PaymentForm.scss"

export default function PaymentForm({ pPaymentMethod, pPaymentIntent }) {
    const stripe = useStripe()
    const elements = useElements()
    const [cvcError, setCvcError] = useState(null)
    const { card, billing_details } = pPaymentMethod
    const navigate = useNavigate()

    const handleSubmit = async (pE) => {
        pE.preventDefault()
        stripe
            .createToken('cvc_update', elements.getElement(CardCvcElement))
            .then(result => {
                if (result.error) {
                    setCvcError(result.error.message)
                } else {
                    postRequest('/stripe/payment/confirm', {
                        paymentMethodId: pPaymentMethod.id,
                        paymentTransactionId: pPaymentIntent.id,
                    })
                        .then(resp => {
                            console.log(resp.data)
                            handleServerResponse(resp.data)
                        })
                        .catch(err => {
                            console.log(err)
                            if (err.status === 401) {
                                alert("Token Expired.")
                                navigate("/login")
                                return
                            }

                            alert("Payment confirm failed.")
                            navigate("/make-payment")
                            return
                        })
                }
            })
            .catch(err => {
                console.log(err)
                alert("Stripe payment confirm failed.")
                navigate("/make-payment")
                return
            })
    }

    function handleServerResponse(pResponse) {
        if (pResponse.error) {

        } else if (pResponse.next_action) {
            handleAction(pResponse)
        } else {
            alert("Payment Success")
            navigate("/make-payment")
            return
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
                                if (err.status === 401) {
                                    alert("Token Expired.")
                                    navigate("/login")
                                    return
                                }
    
                                alert("Payment confirm failed.")
                                navigate("/make-payment")
                                return
                            })
                    }
                })
    }

    return (
        card && (
            <div className="payform-wrapper">
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