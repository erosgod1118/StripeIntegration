import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Register from "./components/Register"
import StripeWrapper from "./components/StripeWrapper"

import './App.scss'

function App() {
	return (
		<StripeWrapper>
			<BrowserRouter>
				<Routes>
					<Route path="/register" element={<Register />} />
				</Routes>
			</BrowserRouter>
		</StripeWrapper>    
	)
}

export default App
