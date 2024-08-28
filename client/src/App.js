import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Register from "./components/Register"
import StripeWrapper from "./components/StripeWrapper"
import AddPayMethod from "./components/AddPayMethod"
import PaymentScreen from "./components/PaymentScreen"

import './App.scss'

function App() {
	return (
		<StripeWrapper>
			<BrowserRouter>
				<Routes>
					<Route path="/register" element={<Register />} />
					<Route path="/add-payment-method" element={<AddPayMethod />} />
					<Route path="/make-payment" element={<PaymentScreen />} />
				</Routes>
			</BrowserRouter>
		</StripeWrapper>
	)
}

export default App
