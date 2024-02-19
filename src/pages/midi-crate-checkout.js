import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AudioPlayerMidiCrate from "../components/AudioPlayerMidiCrate"
import MidiCrateCheckoutForm from "../components/MidiCrateCheckoutForm"
import { MdPlayArrow, MdPause } from "react-icons/md"
import { IoStarSharp } from "react-icons/io5"
import { FaDiamond } from "react-icons/fa6"
import { TfiLock } from "react-icons/tfi"
import { useSiteContext } from "../hooks/use-site-context"

import { allProducts } from "../data/all-products"
import { v4 as uuidv4 } from "uuid"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(
  "pk_test_51MplK1AHwqgwuHo3WGTdPMNEuleddIAg8UbILfyuEMmMUzKJTE0Pj4zj2zGyBJWYalkI60kQnCivUYfe92P6Sp9300a20YnF2m"
)

const MidiCrateCheckoutPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const [customerId, setCustomerId] = React.useState(null)
  const [customerName, setCustomerName] = React.useState(null)
  const [customerEmail, setCustomerEmail] = React.useState(null)
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false)
  const isBrowser = typeof window !== "undefined"
  const currentSong = allProducts[currentSongIndex]
  // console.log(currentSong);

  const options = {
    mode: "subscription",
    amount: 0,
    currency: "usd",
    // Fully customizable with appearance API.
    appearance: {
      theme: "night",
      labels: "floating",
      variables: {
        colorPrimary: 'rgb(45 212 191)',
      },
      rules: {
        ".TermsText": {
          color: "rgb(17 24 39)",
          fontSize: "0",
        },
        // See all supported class names and selector syntax below
      },
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

  const openPopup = () => {
    let eventID = uuidv4()
    conversionsAPI(eventID, "AddToCart")
    if (isBrowser && window.fbq)
      window.fbq("track", "AddToCart", {}, { eventID: eventID })

    setIsMidiCratePopupOpen(true)
  }

  async function createCustomer() {
    const res = await fetch("/.netlify/functions/stripe-create-customer", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "seadoo14@gmail.com",
        name: "AJ",
      }),
    })
    const data = await res.json()
    setCustomerId(data.customer.id)
    setCustomerName("AJ")
    setCustomerEmail("seadoo14@gmail.com")
  }

  return (
    <Layout hideCart isPlayerOpen={currentSongIndex !== -1}>
      <div className="relative">
        <StaticImage
          quality={95}
          src="../images/northern-lights-2.jpg"
          placeholder="blurred"
          alt=""
          className="relative w-full h-24 sm:h-36"
        />
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <h2 className="text-2xl font-bold tracking-wide text-center text-white sm:tracking-normal sm:text-4xl xl:text-5xl whitespace-nowrap">
            Ready For Your Free Month?
          </h2>
        </div>
      </div>

      <div className="w-full pt-4 pb-20 md:pt-12 bg-brand-dark">
        <div className="flex flex-col w-full bg-brand-dark mx-auto max-w-[22rem] sm:max-w-xl md:max-w-2xl lg:max-w-[60rem] xl:max-w-5xl">
          <div className="flex flex-wrap justify-around">
            <div className='w-full md:w-auto'>
              <h3 className="text-xl font-bold tracking-wide text-center md:text-justify sm:tracking-normal lg:text-4xl text-brand-teal">
                <span id="pricingsection">Here's What You Get:</span>
              </h3>
              <div className="px-2 mt-2 leading-10 text-white sm:mt-6 sm:px-0 whitespace-nowrap">
                <p className="font-bold">
                  <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
                  180 MIDI Chord Progressions Every Month
                </p>
                <p className="font-bold">
                  <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
                  180 MIDI Arpeggios Every Month
                </p>
                <p className="font-bold">
                  <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
                  BONUS - Free Hip-Hop Loop Kit
                </p>
                <p className="font-bold">
                  <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
                  BONUS - Access To My Discord Community
                </p>
                <p className="font-bold">
                  <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
                  100% Royalty Free
                </p>
                <p className="font-bold">
                  <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
                  Works With Any Audio Software
                </p>
                <p className="font-bold">
                  <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
                  Compatible With Both Mac & PC
                </p>
                <p className="font-bold">
                  <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
                  No Commitments - Cancel Anytime
                </p>
              </div>
            </div>
            <div className='w-full mt-4 md:mt-0 md:w-auto'>
              <h3 className="text-xl font-bold tracking-wide text-center md:text-justify sm:tracking-normal lg:text-4xl text-brand-teal">
                <span id="pricingsection">Complete Your Order:</span>
              </h3>
              <div className="">
                <p className='mt-2 mb-4 font-bold leading-10 text-center text-white sm:mt-6'>First Month Free, Then Only $9/Month</p>
                <Elements stripe={stripePromise} options={options}>
                  <MidiCrateCheckoutForm
                    customerId={customerId}
                    customerName={customerName}
                    customerEmail={customerEmail}
                  />
                </Elements>
              </div>
            </div>
          </div>

          {/* <button
            onClick={() => createCustomer()}
            className="text-3xl text-white mt-96 "
          >
            Create customer
          </button> */}
          <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            WHAT THE PROS SAY
          </h3>
          <div className="flex flex-wrap gap-8 px-2 mt-8 sm:px-0 sm:mt-16 sm:gap-6 md:gap-12 sm:flex-nowrap">
            <div className="flex flex-col">
              <StaticImage
                quality={95}
                src="../images/twysted.jpg"
                placeholder="blurred"
                alt=""
                imgStyle={{ objectFit: "fill" }}
                className={`w-full sm:h-[15rem] lg:h-[23rem] `}
              />
              <div className="flex flex-col py-6 bg-teal-700/50">
                <div className="text-xl font-bold text-center text-white md:text-2xl">
                  Twysted Genius
                </div>
                <div className="text-base font-medium text-center text-white md:text-lg">
                  Multiplatinum, Grammy nominated
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <StaticImage
                quality={95}
                src="../images/kidhazel.jpg"
                placeholder="blurred"
                alt=""
                imgStyle={{ objectFit: "fill" }}
                className={`w-full sm:h-[15rem] lg:h-[23rem] `}
              />
              <div className="flex flex-col py-6 bg-teal-700/50">
                <div className="text-xl font-bold text-center text-white md:text-2xl">
                  Kid Hazel
                </div>
                <div className="text-base font-medium text-center text-white md:text-lg">
                  Multiplatinum, Grammy nominated
                </div>
              </div>
            </div>
          </div>
          <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            ABOUT ME
          </h3>
          <div id="" className="relative flex flex-wrap justify-around mt-12">
            <div className="order-last w-full mt-6 md:order-none md:w-1/2 md:my-auto">
              <div className="text-xl font-bold text-center md:text-2xl text-brand-teal">
                <span className="">Hey, I'm Phelpsie</span>
              </div>
              <div className="px-2 mt-6 text-base text-white md:px-0 lg:text-lg">
                A music producer just like you. Everything you see and hear on
                this website - including the website itself - was created from
                scratch, by me. When you make a purchase from my site, you're
                helping to support a musician like yourself, not a faceless
                corporate entity, and for that I thank you. Feel free to get in
                touch via email at{" "}
                <a href="mailto:phelpsie@phelpsiemusic.com">
                  phelpsie@phelpsiemusic.com
                </a>
                , or hit me up on Instagram anytime with questions, comments, or
                just to discuss music. I appreciate you 🙏
              </div>
            </div>
            <StaticImage
              quality={95}
              src="../images/me.jpg"
              placeholder="blurred"
              alt=""
              imgStyle={{ objectFit: "cover" }}
              className={`order-first md:order-none`}
            />
          </div>
          {/* Reviews section */}
          <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            CUSTOMER REVIEWS
          </h3>
          <div className="flex flex-wrap w-full px-2 mt-12 space-x-0 text-center text-white sm:px-0 md:flex-nowrap md:space-x-6">
            <div className="w-full md:w-1/3">
              <div className="flex justify-center mb-4">
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
              </div>
              <p>
                Every loop from my man Phelpsie is worth 100 of the ones you
                already got. Just pull the trigger fam, these joints hard
              </p>
              <br />
              <p className="font-bold">Darion Williams - Detroit, USA</p>
            </div>
            <div className="w-full mt-6 md:w-1/3 md:mt-0">
              <div className="flex justify-center mb-4">
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
              </div>
              <p>
                Thank you bro, I was able to make 5 beats with your loops so
                far. Every sound is soooo clean
              </p>
              <br />
              <p className="font-bold">Ravi Mahajan - Brampton, Canada</p>
            </div>
            <div className="w-full mt-6 md:w-1/3 md:mt-0">
              <div className="flex justify-center mb-4">
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
              </div>
              <p>
                I compose professionally for film & TV, and I can tell you that
                this guy has it. The variety of vibes is just brilliant!
              </p>
              <br />
              <p className="font-bold">Daniel Morris - Leeds, UK</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-12">
        <TfiLock className="w-8 h-8 text-white" />
        <p className="ml-2 text-lg font-bold text-white sm:text-xl">
          Secure Payment
        </p>
      </div>
      <p className="max-w-xs mx-auto mt-6 mb-12 text-sm text-center text-white sm:text-justify sm:text-base sm:max-w-lg">
        All orders are processed through Stripe, with industry-leading 256-bit
        SSL encryption, and your information is never shared. I respect your
        privacy.
      </p>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="MIDI Crate Checkout" />

export default MidiCrateCheckoutPage
