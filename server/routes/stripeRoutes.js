const router = require('express').Router()

const stripeController = require('../controllers/stripeController')
const { authorize } = require('../middleware/authMiddleware')
const { Roles } = require('../utils/authUtils')

router.post('/payment/method/attach', authorize(Roles.All), stripeController.attachPaymentMethod)
router.get('/payment/methods', authorize(Roles.All), stripeController.getPaymentMethods)
router.post('/payment/create', authorize(Roles.All), stripeController.createPayment)
router.post('/payment/confirm', authorize(Roles.All), stripeController.confirmPayment)

module.exports = router