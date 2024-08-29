const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.createStripeCustomer = async function (pName, pEmail, pPhone) {
    return new Promise(async (resolve, reject) => {
        console.log("Customer Create: ", pName, pEmail, pPhone)
        try {
            const customer = await stripe.customers.create({
                name: pName,
                email: pEmail,
                phone: pPhone,
            })

            resolve(customer)
        } catch (err) {
            console.log("Error creating stripe customer: ", err)
            reject(err)
        }
    })
}

exports.listCustomerPayMethods = async function (pCustomerId) {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethods = await stripe.customers.listPaymentMethods(pCustomerId, {
                type: "card",
            })
            resolve(paymentMethods)
        } catch (err) {
            reject(err)
        }
    })
}

exports.attachMethod = async function ({ pPaymentMethod, pCustomerId }) {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethodAttach = await stripe.paymentMethods.attach(pPaymentMethod.id, {
                customer: pCustomerId,
            })
            resolve(paymentMethodAttach)
        } catch (err) {
            reject(err)
        }
    })
}