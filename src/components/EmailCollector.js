import * as React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { GatsbyImage } from "gatsby-plugin-image"
import { useSiteContext } from "../hooks/use-site-context"
import { useOutsideClick } from "../hooks/use-outside-click"
import { CgSpinner } from "react-icons/cg"
import { HiOutlineShoppingCart } from "react-icons/hi"
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

const EmailCollector = () => {
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
  } = useSiteContext()

  // Get cart contents
  let cartItems = []

  console.log("CART: ", cartItemsFromLS)

  if (cartItemsFromLS.length > 0) {
    JSON.parse(cartItemsFromLS).items.map(item =>
      cartItems.push(
        allProducts[allProducts.findIndex(e => e.prodCode === item)]
      )
    )
  }

  const doCheckout = () => {
    if (isValidEmail) {
      stripeCheckout()
    } else {
      setIsInputBlinking(true)
      setTimeout(() => setIsInputBlinking(false), 700)
    }
  }

  async function stripeCheckout() {
    setIsCheckoutLoading(true)

    let finalCart = {}
    finalCart.cartItems = cartItems
    finalCart.email = emailAddress
    console.log("Final cart: ", finalCart)

    try {
      const res = await fetch("/.netlify/functions/stripe-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalCart),
      })
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
              setTimeout(() => setIsEmailCollectorOpen(false), 350)
            }}
            className="absolute text-white cursor-pointer md:text-lg lg:text-xl top-2 right-2"
          />
          <div className="flex items-center justify-center w-full h-16 md:h-24 crossSellBackground">
            <h2 className="max-w-[16rem] sm:max-w-sm text-xl font-bold text-center text-white md:text-2xl md:max-w-xl">
              Just One More Thing
            </h2>
          </div>
          <p className="mt-6 text-2xl font-bold text-center md:mt-12 md:text-3xl text-brand-teal">
            Where should I send <br className="block md:hidden" />
            your download links?
          </p>
          <p className="mt-4 text-lg font-semibold text-center text-white md:mt-8 md:text-xl">
            Your email address:
          </p>
          <input
            onChange={e => {
              setEmailAddress(e.target.value)
              setIsValidEmail(
                e.target.value.match(
                  /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
                )
              )
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && !isCheckoutLoading) doCheckout()
            }}
            autoFocus
            className={`transition ${
              isInputBlinking && "invalid-email"
            } flex justify-center appearance-none w-64 md:w-72 lg:w-1/3 mx-auto mt-2 text-lg font-semibold text-center bg-white rounded-full outline-none text-brand-dark focus:ring-8 focus:ring-blue-800`}
            type="email"
          />
          <button
            className={`bg-brand-teal hover:bg-teal-300 whitespace-nowrap transition mx-auto flex justify-center ease-in-out hover:scale-110 duration-200 px-12 py-2 mt-8 md:mt-12 text-base md:text-lg text-white font-bold rounded-full ${
              isCheckoutLoading ? "checkout-loading" : ""
            }`}
            type="button"
            disabled={isCheckoutLoading}
            onClick={() => doCheckout()}
          >
            FINISH
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailCollector
