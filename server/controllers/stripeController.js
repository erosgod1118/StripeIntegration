const { attachMethod, listCustomerPayMethods } = require('../utils/stripeUtils')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.attachPaymentMethod = async function (pReq, pRes) {
    const { paymentMethod } = pReq.body
    const customerId = pReq.session.userId

    try {
        const method = await attachMethod({ paymentMethod, customerId })
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
    const { paymentMethod } = pReq.body
    const amount = 1000
    const currency = "USD"
    const userCustomerId = pReq.session.userId

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency,
            customer: userCustomerId,
            payment_method: paymentMethod,
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
    const { paymentIntent, paymentMethod } = pReq.body

    try {
        const intent = await stripe.paymentIntents.confirm(paymentIntent, {
            payment_method: paymentMethod,
        })

        pRes.status(200).json(intent)
    } catch (err) {
        console.log(err)
        pRes.status(500).json("Could not confirm payment")
    }
}