import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { navigate } from "gatsby"
import { CgSpinner } from "react-icons/cg"
import { useSiteContext } from "../hooks/use-site-context"

const SuccessPage = () => {
  const [customerInfo, setCustomerInfo] = React.useState({})
  const { setCartItemsFromLS } = useSiteContext()

  const isBrowser = typeof window !== "undefined"

  const getSHA256Hash = async input => {
    const textAsBuffer = new TextEncoder().encode(input)
    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      textAsBuffer
    )
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(item => item.toString(16).padStart(2, "0")).join("")
  }

  async function conversionsAPI(em, country, currency, value, sessionID) {
    const cookies = document.cookie.split(";")
    let fbp = "none"
    let fbc = "none"
    console.log(cookies)

    cookies.map(cookie => {
      if (cookie.includes("_fbp=")) {
        fbp = cookie.slice(cookie.indexOf("_fbp=") + 5)
        console.log(fbp)
      }
    })
    cookies.map(cookie => {
      if (cookie.includes("_fbc=")) {
        fbc = cookie.slice(cookie.indexOf("_fbc=") + 5)
        console.log(fbc)
      }
    })

    if (fbc === "none" && window.location.search.includes("fbclid=")) {
      const params = new URL(document.location).searchParams
      fbc = "fb.1." + +new Date() + "." + params.get("fbclid")
    }
    try {
      const email = await getSHA256Hash(em)
      const thecountry = await getSHA256Hash(country)
      const thevalue = Number(value.toString().slice(0, -2))
      console.log("TheValue: ", thevalue)
      const res = await fetch("/.netlify/functions/conversions-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: "Purchase",
          fbp,
          fbc,
          email,
          thecountry,
          currency,
          thevalue,
          sessionID,
        }),
      })
      const result = await res.json()
      console.log("Return from netlify functions conversionsAPI =", result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async function stripeGetCustomerInfo(sessionID) {
    try {
      const res = await fetch("/.netlify/functions/stripe-successpage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionID: sessionID,
        }),
      })
      const data = await res.json()
      console.log("Return from Get Customer Info =", data)

      if (localStorage.getItem("phelpsieSession") !== sessionID) {
        conversionsAPI(
          data.customer.email.toLowerCase(),
          data.customer.address.country.toLowerCase(),
          data.session.currency.toUpperCase(),
          data.session.amount_total,
          sessionID
        )
        if (isBrowser && window.fbq)
          window.fbq(
            "track",
            "Purchase",
            {
              value: Number(data.session.amount_total.toString().slice(0, -2)),
              currency: data.session.currency.toUpperCase(),
            },
            { eventID: sessionID }
          )
        if (isBrowser && window.gtag) {
          // gtag("set", "user_data", {
          //   email: data.customer.email.toLowerCase(),
          // })
          // gtag("event", "conversion", {
          //   send_to: "AW-11150251828/nOO8CNbFuPgYELSu7cQp",
          //   value: Number(data.session.amount_total.toString().slice(0, -2)),
          //   currency: data.session.currency.toUpperCase(),
          //   transaction_id: "",
          // })
        }
      } else {
        console.log("duplicate session conversion prevented")
      }
      localStorage.setItem("phelpsieSession", sessionID)
      setCustomerInfo(data.customer)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  React.useEffect(() => {
    const params = new URL(document.location).searchParams
    const sessionID = params.get("session_id")
    console.log(sessionID)
    const customer = stripeGetCustomerInfo(sessionID.toString())
    localStorage.removeItem("phelpsieCart")
    setCartItemsFromLS([])
  }, [])

  return (
    <Layout>
      <div className="max-w-xs mx-auto my-auto sm:max-w-md md:max-w-3xl">
        {!customerInfo.name ? (
          <div>
            <h2 className="mx-auto text-3xl font-bold text-center text-white sm:text-4xl">
              Loading Order Details
            </h2>
            <CgSpinner className="w-24 h-24 mx-auto mt-6 text-brand-teal spinner" />
          </div>
        ) : (
          <>
            <h2 className="mx-auto text-3xl font-bold text-center sm:text-4xl text-brand-teal">
              Thank you, {customerInfo.name}
            </h2>
            <p className="mt-6 text-lg text-center text-white md:text-xl">
              Please check your email at {customerInfo.email} for your download
              links.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center justify-center px-4 py-1 mx-auto mt-12 text-xl font-bold text-white rounded-full bg-brand-teal"
            >
              Back To Shop
            </button>
          </>
        )}
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Thank You" />

export default SuccessPage
