import React, { useState, useEffect } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Country, State, City } from "country-state-city"
import Select from "react-select";

import "./AddPayMethod.scss"
import { postRequest } from "../../utils/api"

export default function AddPayMethod() {
    const stripe = useStripe()
    const elements = useElements()

    const [cardInfo, setCardInfo] = useState({
        name: "",
        expiry: "",
        number: "",
        address: {
            line: "",
            postalCode: "",
        },
    })
    const [locations, setLocations] = useState({ countries: [], states: [], cities: [] })
    const [selectedLocation, setSelectedLocation] = useState({ contry: {label: "", value: ""}, city: {label: "", value: ""}, state: {label: "", value: ""} })

    function handleChangeAddressLine(pE) {
        const { value } = pE.target
        setCardInfo(prev => {
            return { ...prev, address: { ...prev.address, line: value } }
        })
    }

    function handleChangeName(pE) {
        const { value } = pE.target
        setCardInfo(prev => {
            return { ...prev, name: value }
        })
    }

    function parseForSelect(pArr) {
        return pArr.map(item => ({
            label: item.name,
            value: item.isoCode ? item.isoCode : item.name,
        }))
    }

    function handleSelectCountry(pCountry) {
        const states = State.getStatesOfCountry(pCountry.value)
        
        setSelectedLocation(prev => {
            return { ...prev, country: pCountry }
        })
        setLocations(prev => {
            return { ...prev, states: parseForSelect(states) }
        })
    }

    function handleSelectState(pState) {
        const cities = City.getCitiesOfState(selectedLocation.country.value, pState.value)

        setSelectedLocation(prev => {
            return { ...prev, state: pState }
        })
        setLocations(prev => ({ ...prev, cities: parseForSelect(cities) }))
    }

    function handleSelectCity(pCity) {
        setSelectedLocation(prev => {
            return { ...prev, city: pCity }
        })
    }

    async function handleSubmit() {
        const address = cardInfo.address
        const billingDetails = {
            name: cardInfo.name,
            address: {
                country: address.country,
                state: address.state,
                city: address.city,
                line1: address.line,
            },
        }

        try {
            stripe.createPaymentMethod({
                type: "card",
                billing_details: billingDetails,
                card: elements.getElement(CardElement),
            })
            .then(resp => {
                postRequest("/stripe/payment/method/attach", { paymentMethod: resp.paymentMethod, stripeCustomerId: localStorage.getItem("loggedInStripeCustomerId") })
                    .then(resp => {
                        alert("New payment method attached successfully!")
                    })
                    .catch(err => {

                    })
            })
        } catch (err) {

        }
    }

    useEffect(() => {
        const allCountries = Country.getAllCountries()

        setLocations(prev => {
            return { ...prev, countries: parseForSelect(allCountries) }
        })
    }, [])

    return (
        <div className="wrapper">
            <div className="innerWrapper">
                <div className="title">Add Payment Method</div>
                <div className="row">
                    <label>Cardholder Name</label>
                    <input
                        onChange={handleChangeName}
                        type="text"
                        name="name"
                        placeholder="Enter card holder name"
                    />
                </div>
                <div className="rowPaymentInput">
                    <CardElement />
                </div>
                <div className="addressWrapper">
                    <div className="row">
                        <label>Address</label>
                        <input
                            onChange={handleChangeAddressLine}
                            type="text"
                            name="address"
                            placeholder="Enter Full Address"
                        />
                    </div>
                    <div className="rowSelect">
                        <div>
                            <label>Country</label>
                            <Select
                                isClearable={true}
                                isSearchable={true}
                                name="country"
                                value={selectedLocation.country}
                                options={locations.countries}
                                onChange={handleSelectCountry}
                            />
                        </div>
                        <div>
                            <label>State</label>
                            <Select
                                isClearable={true}
                                isSearchable={true}
                                name="state"
                                value={selectedLocation.state}
                                options={locations.states}
                                onChange={handleSelectState}
                            />
                        </div>
                    </div>
                    <div className="rowSelect">
                        <div>
                            <label>City</label>
                            <Select
                                isClearable={true}
                                isSearchable={true}
                                name="city"
                                value={selectedLocation.city}
                                options={locations.cities}
                                onChange={handleSelectCity}
                            />
                        </div>
                    </div>
                    <div className="btnContainer">
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}