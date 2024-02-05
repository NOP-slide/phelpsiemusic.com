import * as React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { GatsbyImage } from "gatsby-plugin-image"
import { useSiteContext } from "../hooks/use-site-context"
import { useOutsideClick } from "../hooks/use-outside-click"
import { CgSpinner } from "react-icons/cg"
import { HiOutlineShoppingCart } from "react-icons/hi"
import { FaDiamond } from "react-icons/fa6"
import VideoProgressBar from "./VideoProgressBar"
import {
  MdClose,
  MdPlayArrow,
  MdPause,
  MdVolumeOff,
  MdVolumeUp,
  MdStop,
} from "react-icons/md"
import { allProducts } from "../data/all-products"
import { v4 as uuidv4 } from "uuid"

const MidiCratePopup = () => {
  const [modalOpen, setModalOpen] = React.useState(true)
  const [isPlayingModalAudio, setIsPlayingModalAudio] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)
  const [emailAddress, setEmailAddress] = React.useState("")
  const [isValidEmail, setIsValidEmail] = React.useState(null)
  const [isInputBlinking, setIsInputBlinking] = React.useState(null)
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false)
  const {
    setIsCrossSellModalOpen,
    crossSellItem,
    crossSellItemNum,
    setPlayerZIndexBoost,
    playerZIndexBoost,
    cartItemsFromLS,
    setCartItemsFromLS,
    setIsEmailCollectorOpen,
    setIsMidiCratePopupOpen,
  } = useSiteContext()

  const isBrowser = typeof window !== "undefined"

  // Get cart contents
  let cartItems = []

  if (cartItemsFromLS.length > 0) {
    JSON.parse(cartItemsFromLS).items.map(item =>
      cartItems.push(
        allProducts[allProducts.findIndex(e => e.prodCode === item)]
      )
    )
  }

  async function conversionsAPI(eventID, eventType) {
    const cookies = document.cookie.split(";")
    let fbp = "none"
    let fbc = "none"

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
      const res = await fetch("/.netlify/functions/conversions-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: eventType,
          fbp,
          fbc,
          eventID,
          content_name: "MIDI Crate",
        }),
      })
      const result = await res.json()
      console.log("Return from netlify functions conversionsAPI =", result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async function stripeMidiCrateCheckout() {
    setIsCheckoutLoading(true)

    let eventID = uuidv4()
    const capi = await conversionsAPI(eventID, "InitiateCheckout")
    if (isBrowser && window.fbq)
      window.fbq("track", "InitiateCheckout", {}, { eventID: eventID })

    let stripeCode = "price_1OH8QSAHwqgwuHo3DFgteSqv"
    console.log("Subscription cart: ", stripeCode)

    try {
      const res = await fetch(
        "/.netlify/functions/stripe-subscription-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stripeCode),
        }
      )
      const data = await res.json()
      console.log("Return from netlify functions =", data)
      window.location = data.url
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      setIsCheckoutLoading(false)
    }
  }

  return (
    <div
      className={`cart-modal-container transform ${
        modalOpen ? "cart-modal-fadein" : "cart-modal-fadeout"
      }`}
    >
      <div
        className={`fixed pb-6 md:pb-12 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl top-6 -translate-y-0 md:top-1/3 left-1/2 -translate-x-1/2 md:-translate-y-1/3 bg-brand-dark ${
          modalOpen ? "cross-sell-modal-fadein" : "cross-sell-modal-fadeout"
        }`}
      >
        <div className="relative w-full h-full">
          <MdClose
            onClick={() => {
              setModalOpen(false)
              setTimeout(() => setIsMidiCratePopupOpen(false), 350)
            }}
            className="absolute text-white cursor-pointer md:text-lg lg:text-xl top-2 right-2"
          />
          <div className="flex items-center justify-center w-full h-16 md:h-24 crossSellBackground">
            <h2 className="max-w-[16rem] sm:max-w-sm text-base font-bold text-center text-white md:text-2xl md:max-w-xl">
              Your Free MIDIs Are Waiting
            </h2>
          </div>
          <p className="mt-6 text-xl font-bold text-center md:mt-12 md:text-3xl text-brand-teal">
            <span className="font-bold">
              First Month Free, Then Only
              <br />
              <span className="text-red-600 line-through"> $27</span>
              <span className="text-brand-teal">{' '}$9/Month</span>
            </span>
          </p>
          {/* <input
            onChange={e => {
              setEmailAddress(e.target.value)
              setIsValidEmail(
                e.target.value.match(
                  /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
                  )
                  )
                }}
                onKeyDown={(e)=>e.key === 'Enter' && doCheckout() }
                autoFocus
                className={`transition ${
                  isInputBlinking && "invalid-email"
                } flex justify-center appearance-none w-64 md:w-72 lg:w-1/3 mx-auto mt-2 text-lg font-semibold text-center bg-white rounded-full outline-none text-brand-dark focus:ring-8 focus:ring-blue-800`}
                type="email"
              /> */}
          <div className="pl-4 mt-4 text-sm text-white sm:pl-20 md:pl-40 lg:pl-64 md:text-base lg:text-lg">
            <p className="font-semibold">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" /> 180
              MIDI Chord Progressions Every Month
            </p>
            <br />
            <p className="font-semibold">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" /> 180
              MIDI Arpeggios Every Month
            </p>
            <br />
            <p className="font-semibold">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Bonus - Free Hip-Hop Loop Kit
            </p>
            <br />
            <p className="font-semibold">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Bonus - Access To My Discord Community
            </p>
          </div>
          <button
            className={`bg-brand-teal hover:bg-teal-300 whitespace-nowrap transition mx-auto flex justify-center ease-in-out hover:scale-110 duration-200 px-12 py-2 mt-8 text-base md:text-lg text-white font-bold rounded-full ${
              isCheckoutLoading ? "checkout-loading" : ""
            }`}
            type="button"
            onClick={() => stripeMidiCrateCheckout()}
          >
            GO TO FREE CHECKOUT
          </button>
          <p className="mt-4 text-xs font-semibold text-center text-gray-400 md:text-base">
            Cancel anytime with 1 click, no questions asked
          </p>
        </div>
      </div>
    </div>
  )
}

export default MidiCratePopup
