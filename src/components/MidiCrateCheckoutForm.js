import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CgSpinner } from "react-icons/cg"

const MidiCrateCheckoutForm = ({ customerId, customerName, customerEmail }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isStripeFormLoading, setIsStripeFormLoading] = React.useState(true)
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
        return_url: `https://www.phelpsiemusic.com/success-mc?vr1=${temp2}&vr2=${temp4}`,
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
    <form onSubmit={handleSubmit} className="">
      {/* <div className={`${isStripeFormLoading ? "mb-6" : "mb-0"}`} /> */}
      {isStripeFormLoading && (
        <CgSpinner className="m-6 mx-auto w-36 h-36 text-brand-teal spinner" />
      )}
      <PaymentElement
        onReady={() => setIsStripeFormLoading(false)}
        options={{
          layout: {
            type: "tabs",
            defaultCollapsed: false,
          },
          defaultValues: {
            billingDetails: {
              email: "seadoo14@gmail.com",
            },
          },
        }}
      />
      <p className={`-mt-4 text-sm text-center text-gray-400 `}>
        Try it risk-free. Cancel anytime with 1 click
      </p>
      <button
        className={`bg-brand-teal hover:bg-teal-300 whitespace-nowrap transition mx-auto flex justify-center ease-in-out hover:scale-110 duration-200 px-24 py-2 mt-4 text-base md:text-lg text-white font-bold rounded-full ${
          isLoading ? "checkout-loading" : ""
        }`}
        disabled={!stripe || isLoading || isStripeFormLoading}
      >
        FINISH
      </button>
      {errorMessage && (
        <div
          style={{ color: "rgb(254, 135, 161)" }}
          className="mt-4 text-center"
        >
          Error: {errorMessage}
        </div>
      )}
    </form>
  )
}

export default MidiCrateCheckoutForm
