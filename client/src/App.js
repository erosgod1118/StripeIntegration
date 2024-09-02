import React, { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { ProtectedRoute } from "./routes/ProtectedRoute"
import AuthProvider from "./provider/AuthProvider"

import './App.scss'

const Register = lazy(() => import("./pages/Register/Register"))
const Login = lazy(() => import("./pages/Login/Login"))
const Logout = lazy(() => import("./pages/Logout/Logout"))
const StripeWrapper = lazy(() => import("./components/StripeWrapper"))
const AddPayMethod = lazy(() => import("./pages/AddPaymentMethod/AddPayMethod"))
const PaymentScreen = lazy(() => import("./pages/MakePayment/PaymentScreen"))

function App() {
	return (
		<AuthProvider>
			<StripeWrapper>
				<BrowserRouter>
					<Routes>
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Logout />} />
						<Route element={<ProtectedRoute />}>
							<Route path="/add-payment-method" element={<AddPayMethod />} />
							<Route path="/make-payment" element={<PaymentScreen />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</StripeWrapper>
		</AuthProvider>
	)
}

export default App
