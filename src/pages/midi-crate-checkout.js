import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AudioPlayerMidiCrate from "../components/AudioPlayerMidiCrate"
import { MdPlayArrow, MdPause } from "react-icons/md"
import { IoStarSharp } from "react-icons/io5"
import { FaDiamond } from "react-icons/fa6"
import { TfiLock } from "react-icons/tfi"
import { useSiteContext } from "../hooks/use-site-context"

import { allProducts } from "../data/all-products"
import { v4 as uuidv4 } from "uuid"
import { Elements, PaymentElement } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const MidiCrateCheckoutPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false)
  const isBrowser = typeof window !== "undefined"
  const currentSong = allProducts[currentSongIndex]
  // console.log(currentSong);
  const stripePromise = loadStripe(
    "pk_test_51MplK1AHwqgwuHo3WGTdPMNEuleddIAg8UbILfyuEMmMUzKJTE0Pj4zj2zGyBJWYalkI60kQnCivUYfe92P6Sp9300a20YnF2m"
  )

  const options = {
    mode: "subscription",
    amount: 0,
    currency: "usd",
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
    // Fully customizable with appearance API.
    appearance: {
      theme: 'night',
      labels: 'floating',
      /*...*/
    },
  }

  const {
    setIsVideoPlayerOpen,
    setVideoPlayerSrc,
    setIsCartOpen,
    cartItemsFromLS,
    isCrossSellModalOpen,
    setIsCrossSellModalOpen,
    setCrossSellItem,
    setCrossSellItemNum,
    crossSellItemNum,
    setCartItemsFromLS,
    setIsMidiCratePopupOpen,
    playerZIndexBoost,
  } = useSiteContext()

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

  async function stripeSubscriptionCheckout() {
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

  const PlayButton = ({ title, trackNum }) => {
    return (
      <div className="flex items-center">
        <button
          type="button"
          id="productplaybutton"
          onClick={e => {
            if (currentSongIndex !== trackNum) {
              e.stopPropagation()
              setIsPaused(false)
              setCurrentSongIndex(trackNum)
            }
            if (currentSongIndex === trackNum) {
              e.stopPropagation()
              setIsPaused(!isPaused)
            }
          }}
          className="h-24 text-white"
        >
          {isPaused === false && currentSongIndex === trackNum ? (
            <MdPause
              id="productplaybutton"
              className="w-10 h-10 p-2 transition duration-200 ease-in-out rounded-full md:w-12 md:h-12 lg:w-14 lg:h-14 checkout-loading hover:scale-110"
            />
          ) : (
            <MdPlayArrow
              id="productplaybutton"
              className="w-10 h-10 p-2 transition duration-200 ease-in-out rounded-full md:w-12 md:h-12 lg:w-14 lg:h-14 play-button hover:scale-110"
            />
          )}
        </button>
        <p className="max-w-[5rem] md:max-w-none ml-3 text-sm font-bold text-white md:text-lg lg:text-lg">
          {title}
        </p>
      </div>
    )
  }

  const openPopup = () => {
    let eventID = uuidv4()
    conversionsAPI(eventID, "AddToCart")
    if (isBrowser && window.fbq)
      window.fbq("track", "AddToCart", {}, { eventID: eventID })

    setIsMidiCratePopupOpen(true)
  }

  React.useEffect(() => {
    let eventID = uuidv4()
    conversionsAPI(eventID, "ViewContent")
    if (isBrowser && window.fbq)
      window.fbq(
        "track",
        "ViewContent",
        { content_name: "MIDI Crate" },
        { eventID: eventID }
      )
  }, [])

  return (
    <Layout isPlayerOpen={currentSongIndex !== -1}>
      <Elements stripe={stripePromise} options={options}>
        <form className='w-full max-w-lg mx-auto mt-48'>
          <PaymentElement />
          <button>Submit</button>
        </form>
      </Elements>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="MIDI Crate" />

export default MidiCrateCheckoutPage
