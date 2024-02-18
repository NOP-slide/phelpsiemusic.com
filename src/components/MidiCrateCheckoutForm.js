import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const MidiCrateCheckoutForm = ({ customerId, customerName, customerEmail }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = React.useState()

  const handleError = error => {
    setIsLoading(false)
    setErrorMessage(error.message)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit()
    if (submitError) {
      handleError(submitError)
      return
    }

    // Create the subscription
    const res = await fetch("/.netlify/functions/stripe-create-subscription", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: customerId,
      }),
    })
    const { type, clientSecret } = await res.json()
    const confirmIntent =
      type === "setup" ? stripe.confirmSetup : stripe.confirmPayment

    // Confirm the Intent using the details collected by the Payment Element
    let temp1 = ""
    let temp2 = ""

    temp1 = escape(customerName)
    for (let i = 0; i < temp1.length; i++) {
      temp2 += temp1.charCodeAt(i) - 23
    }

    let temp3 = ""
    let temp4 = ""

    temp3 = escape(customerEmail)
    for (let i = 0; i < temp3.length; i++) {
      temp4 += temp3.charCodeAt(i) - 23
    }

    const { error } = await confirmIntent({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:8888/success-mc?vr1=${temp2}&vr2=${temp4}`,
      },
    })

    if (error) {
      // This point is only reached if there's an immediate error when confirming the Intent.
      // Show the error to your customer (for example, "payment details incomplete").
      handleError(error)
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mt-48">
      <PaymentElement
        options={{
          layout: {
            type: "tabs",
            defaultCollapsed: false,
          },
        }}
      />
      <button
        disabled={!stripe || isLoading}
        className="w-full mx-auto mt-4 text-4xl text-white"
      >
        Submit
      </button>
      {errorMessage && <div className="text-xl text-white">{errorMessage}</div>}
    </form>
  )
}

export default MidiCrateCheckoutForm
