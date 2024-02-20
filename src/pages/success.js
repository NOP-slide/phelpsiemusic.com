import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { navigate } from "gatsby"
import { CgSpinner } from "react-icons/cg"
import { useSiteContext } from "../hooks/use-site-context"
import { allProducts } from "../data/all-products"
import { MdPlayArrow, MdPause } from "react-icons/md"
import { StaticImage } from "gatsby-plugin-image"

const SuccessPage = () => {
  const [customerInfo, setCustomerInfo] = React.useState({})
  const [sessionInfo, setSessionInfo] = React.useState({})
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isHoveringProd1, setIsHoveringProd1] = React.useState(false)
  const [isHoveringProd2, setIsHoveringProd2] = React.useState(false)
  const [isHoveringProd3, setIsHoveringProd3] = React.useState(false)

  const currentSong = allProducts[currentSongIndex]

  const {
    isCrossSellModalOpen,
    crossSellItemNum,
    playerZIndexBoost,
    setVideoPlayerSrc,
    setIsVideoPlayerOpen,
    setCartItemsFromLS,
  } = useSiteContext()

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
      const thevalue = value < 1 ? 9.0 : Number(value.toString().slice(0, -2))
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
  async function conversionsAPISubscribe(
    em,
    country,
    currency,
    value,
    sessionID
  ) {
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
      const thevalue = value < 1 ? 9.0 : Number(value.toString().slice(0, -2))
      console.log("TheValue: ", thevalue)
      const res = await fetch("/.netlify/functions/conversions-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: "Subscribe",
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
        const res1 = await conversionsAPI(
          data.customer.email.toLowerCase(),
          data.customer.address.country.toLowerCase(),
          data.session.currency.toUpperCase(),
          data.session.amount_total,
          sessionID
        )
        const res2 = await conversionsAPISubscribe(
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
              value:
                data.session.amount_total < 1
                  ? 9.0
                  : Number(data.session.amount_total.toString().slice(0, -2)),
              currency: data.session.currency.toUpperCase(),
            },
            { eventID: sessionID }
          )
        window.fbq("track", "Subscribe", {}, { eventID: sessionID })
        if (isBrowser && window.gtag) {
          gtag("set", "user_data", {
            email: data.customer.email.toLowerCase(),
          })
          gtag("event", "conversion", {
            send_to: "AW-11150251828/nOO8CNbFuPgYELSu7cQp",
            value: data.session.amount_total < 1 ? 9.00 : Number(data.session.amount_total.toString().slice(0, -2)),
            currency: data.session.currency.toUpperCase(),
            transaction_id: "",
          })
        }
      } else {
        console.log("duplicate session conversion prevented")
      }
      localStorage.setItem("phelpsieSession", sessionID)
      setCustomerInfo(data.customer)
      setSessionInfo(data.session)
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
      <div
        className={`max-w-xs mx-auto ${
          sessionInfo.mode !== "subscription" ? "my-auto" : "mt-2"
        } sm:max-w-md md:max-w-3xl`}
      >
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
            <p className="mt-2 text-lg text-center text-white md:text-xl">
              Please check your email at {customerInfo.email} for your download
              links.
            </p>
            {sessionInfo.mode !== "subscription" && (
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center justify-center px-4 py-1 mx-auto mt-12 text-xl font-bold text-white rounded-full bg-brand-teal"
              >
                Back To Shop
              </button>
            )}
          </>
        )}
      </div>
      {sessionInfo.mode === "subscription" && (
        <div className="w-full mt-6 mb-12 bg-brand-dark">
          <div className='max-w-xs mx-auto mb-6 border-t-2 border-gray-600 sm:max-w-lg'/>
          <div className="text-2xl font-bold text-center text-brand-teal">
            Produce Hip-Hop?
          </div>
          <div className="max-w-xs mx-auto mt-2 text-base text-center text-white md:text-lg md:max-w-lg">
            To thank you for checking out MIDI Crate, get <span className='font-bold text-brand-teal'>20% OFF</span> these dope loop
            kits using the code <span className='font-bold text-brand-teal'>THANKYOU</span> at checkout.
          </div>
          <div className="flex w-full h-full max-w-[22rem] sm:gap-4 mt-4 sm:max-w-xl gap-0 mx-auto md:max-w-2xl lg:max-w-[60rem] xl:max-w-5xl lg:gap-10">
            <div
              onMouseEnter={() => setIsHoveringProd1(true)}
              onMouseLeave={() => setIsHoveringProd1(false)}
              onClick={() => {
                navigate("/imaginarium-vol-1/")
              }}
              className="relative w-1/2 p-2 md:p-4 bg-brand-tealDark hover:cursor-pointer"
            >
              <div className="relative">
                <StaticImage
                  quality={95}
                  src="../images/products/1-imaginarium-vol-1-art.jpg"
                  placeholder="blurred"
                  alt=""
                  className={` transition ease-in-out duration-300 w-full h-48 sm:h-64 lg:h-[28rem] ${
                    isHoveringProd1 && "brightness-75"
                  }`}
                />
                <button
                  type="button"
                  className={`${
                    isHoveringProd1 ? "opacity-100" : "opacity-0"
                  } transition ease-in-out duration-500 absolute px-4 text-sm sm:px-8 lg:px-16 py-1 md:py-3 sm:text-lg font-bold text-white -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 whitespace-nowrap bg-brand-teal`}
                >
                  LEARN MORE
                </button>
              </div>
              <div className="flex items-center justify-between mt-6 mb-3">
                <p className="max-w-[6rem] sm:max-w-[10rem] md:max-w-[13rem] text-sm font-bold text-white hover:text-gray-300 sm:text-base">
                  {allProducts[0].title}
                </p>
                {/* <div className="flex flex-col gap-1">
                  <p className="px-2 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full sm:text-sm">
                    ${allProducts[0].oldPrice}
                  </p>
                  <p className="px-2 text-lg font-bold sm:text-xl text-brand-teal">
                    ${allProducts[0].price}
                  </p>
                </div> */}
              </div>
            </div>
            <div
              onMouseEnter={() => setIsHoveringProd2(true)}
              onMouseLeave={() => setIsHoveringProd2(false)}
              onClick={() => {
                navigate("/imaginarium-vol-2/")
              }}
              className="relative w-1/2 p-2 md:p-4 bg-brand-tealDark hover:cursor-pointer"
            >
              <div className="relative">
                <StaticImage
                  quality={95}
                  src="../images/products/2-imaginarium-vol-2-art.jpg"
                  placeholder="blurred"
                  alt=""
                  className={` transition ease-in-out duration-300 w-full h-48 sm:h-64 lg:h-[28rem] ${
                    isHoveringProd2 && "brightness-75"
                  }`}
                />
                <button
                  type="button"
                  className={`${
                    isHoveringProd2 ? "opacity-100" : "opacity-0"
                  } transition ease-in-out duration-500 absolute px-4 text-sm sm:px-8 lg:px-16 py-1 md:py-3 sm:text-lg font-bold text-white -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 whitespace-nowrap bg-brand-teal`}
                >
                  LEARN MORE
                </button>
              </div>
              <div className="flex items-center justify-between mt-6 mb-3">
                <p className="max-w-[6rem] sm:max-w-[10rem] md:max-w-[13rem] text-sm font-bold text-white hover:text-gray-300 sm:text-base">
                  {allProducts[1].title}
                </p>
                {/* <div className="flex flex-col gap-1">
                  <p className="px-2 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full sm:text-sm">
                    ${allProducts[1].oldPrice}
                  </p>
                  <p className="px-2 text-lg font-bold sm:text-xl text-brand-teal">
                    ${allProducts[1].price}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export const Head = () => <Seo title="Thank You" />

export default SuccessPage
