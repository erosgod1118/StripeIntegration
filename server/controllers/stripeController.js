const { attachMethod, listCustomerPayMethods } = require('../utils/stripeUtils')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.attachPaymentMethod = async function (pReq, pRes) {
    const { paymentMethod, stripeCustomerId } = pReq.body

    try {
        const method = await attachMethod(paymentMethod, stripeCustomerId)
        console.log(method)
        pRes.status(200).json({ message: "Payment method attached successfully" })
    } catch (err) {
        console.log(err)
        pRes.status(400).json({ message: "Could not attach method" })
    }
}

exports.getPaymentMethods = async function (pReq, pRes) {
    const stripeCustomerId = pReq.query.stripeCustomerId
    if (stripeCustomerId == undefined) {
        console.log("Stripe Customer Id is undefined")
        pRes.status(500).json("Stripe customer Id is undefined")
    }

    try {
        const paymentMethods = await listCustomerPayMethods(stripeCustomerId)
        pRes.status(200).json(paymentMethods)
    } catch (err) {
        console.log(err)
        pRes.status(500).json("Could not get payment methods")
    }
}

exports.createPayment = async function (pReq, pRes) {
    const { paymentMethodId, stripeCustomerId } = pReq.body
    const amount = 1000
    const currency = "USD"

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency,
            customer: stripeCustomerId,
            payment_method: paymentMethodId,
            confirmation_method: "manual",
            description: "Buy Product",
        })

        pRes.status(200).json(paymentIntent)
    } catch (err) {
        console.log(err)
        pRes.status(500).json("Could not create payment")
    }
}

exports.confirmPayment = async function (pReq, pRes) {
    const { paymentTransactionId, paymentMethodId } = pReq.body

    try {
        const intent = await stripe.paymentIntents.confirm(
            paymentTransactionId, 
            {
                payment_method: paymentMethodId,
                return_url: 'http://localhost:3000/make-payment'
            }
        )

        pRes.status(200).json(intent)
    } catch (err) {
        console.log(err)
        pRes.status(500).json("Could not confirm payment")
    }
}