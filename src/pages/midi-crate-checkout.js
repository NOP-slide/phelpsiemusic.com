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
import { Tab } from "@headlessui/react"

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(
  "pk_live_51MplK1AHwqgwuHo39JVgHbX84FyoQbDjUIUeLvTB93pug2ZDAPepzVow5DPAadqyqt6P4M3AgHSF0ON6FrClPaQS00bhUrO46Z"
)

const MidiCrateCheckoutPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isBusyCreatingCustomer, setIsBusyCreatingCustomer] =
    React.useState(false)
  const [customerId, setCustomerId] = React.useState(null)
  const [hasFiredInitiateCheckout, setHasFiredInitiateCheckout] =
    React.useState(false)
  const [hasAddedAbandonedCart, setHasAddedAbandonedCart] =
    React.useState(false)
  const [customerName, setCustomerName] = React.useState("")
  const [customerEmail, setCustomerEmail] = React.useState("")
  const [createdName, setCreatedName] = React.useState("")
  const [createdEmail, setCreatedEmail] = React.useState("")
  const [isFormNameError, setIsFormNameError] = React.useState(false)
  const [isFormEmailError, setIsFormEmailError] = React.useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const isBrowser = typeof window !== "undefined"
  const currentSong = allProducts[currentSongIndex]
  // console.log(currentSong);

  const options = {
    mode: "subscription",
    amount: 0,
    currency: "usd",
    loader: "never",
    // Fully customizable with appearance API.
    appearance: {
      theme: "night",
      labels: "floating",
      variables: {
        colorPrimary: "rgb(45 212 191)",
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
    isUrgencyBannerOpen,
  } = useSiteContext()

  React.useEffect(() => {
    if (
      isBrowser &&
      window.location.search.includes("v1=") &&
      window.location.search.includes("amp;v2=") &&
      window.location.search.includes("amp;v3=")
    ) {
      const params = new URL(document.location).searchParams
      const name = params.get("v1")
      let str_out = ""

      let num_out = name
      for (let i = 0; i < num_out.length; i += 2) {
        let num_in = parseInt(num_out.substr(i, [2])) + 23
        num_in = unescape("%" + num_in.toString(16))
        str_out += num_in
      }
      const email = params.get("amp;v2")
      let str_out2 = ""

      let num_out2 = email
      for (let i = 0; i < num_out2.length; i += 2) {
        let num_in2 = parseInt(num_out2.substr(i, [2])) + 23
        num_in2 = unescape("%" + num_in2.toString(16))
        str_out2 += num_in2
      }
      setCustomerName(unescape(str_out))
      setCreatedName(unescape(str_out))
      setCustomerEmail(unescape(str_out2))
      setCreatedEmail(unescape(str_out2))
      const custId = params.get("amp;v3")
      setCustomerId(unescape(custId))
    }
  }, [])

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

  async function addAbandonedCart(id) {
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

    try {
      const res = await fetch(
        "https://connect.mailerlite.com/api/subscribers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNTZkN2ViYmNhOTNiYTYwYWU1ZjhlY2MwZDkxN2JmYzE3MWExM2FjY2FmYTI0OGUzOTRjYTMxNzFkYzJlOGY2Mzk2ODYwNTdmY2EwODJjZjIiLCJpYXQiOjE2OTczMDI2MzEuNDQzOTksIm5iZiI6MTY5NzMwMjYzMS40NDM5OTIsImV4cCI6NDg1Mjk3NjIzMS40Mzk4NTYsInN1YiI6IjU5NTA0MCIsInNjb3BlcyI6W119.tK7vkOIUzMLX1zfxmJA6SofJfRetwAc4k6P-6qQ_hyhErCLBAZC-oq3kpyZHsgLopoqIkQSKOAJ_HsHGjgb8Ar1NQiiGcCoql3QCXAYzAJCC8qiOW-OVHf3KoS5gWbbD-R6juOvsP32Vm-PA2f54eqOrHOIRoh0bX7aO4ZSxK1bl6L07u3avVgSduyWzkgXQzMRbZ5M0a8POn5JCnvrMVrxu-w0L48hRT5daossj4HhdaUsA72VtBH_EFoPiQEDIOxdbThtqsMNLxmePsC6nz2o__41dqheKfAhbBurhUpgtovO0QQNoUCOE-PJwZLjM6KLqmNCtfRIrzEL_HwDUK8Vvnp_And8bvUvf4TBIwptXiJw-6v4cvBrkpn37Zc6s0J8wk5qqNYhgQVButjR9Wj2oDHJ1pOF9IASslsqLrowwwQjoAN4d699gGUrb9aofv1o7yKTN3S-Ed-sOMUuMM_ybWKgxzkcCPY0rcVHLTo8T52dBjHD5L4JQOdqnaD96ehNds0uK6pZ1Q0BsGYba5Ucpopd4T5_DfuAh1bmEFjmD8z-BBag382jp0_eOTkH1wsT4NstuFJzbTvI-Jn1G5FyaGkc3-0DuWuOhjnpTImjx7lHxhzmt7lausraIqO3cve3O6XhQtBNdJqOyHeVBIU29leB-whazwWOA_yfdNCs",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: customerEmail,
            fields: {
              name: customerName,
              recovery_url: `https://www.phelpsiemusic.com/midi-crate-checkout?v1=${temp2}&v2=${temp4}&v3=${id}`,
            },
            groups: ["113629656536582040"],
          }),
        }
      )
      const data = await res.json()
      console.log("Return from mailerlite =", data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async function goToTab2() {
    let hasError = false

    if (customerName.trim() === "") {
      hasError = true
      setIsFormNameError(true)
    }
    if (
      customerEmail.trim() === "" ||
      !customerEmail.match(
        /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
      )
    ) {
      hasError = true
      setIsFormEmailError(true)
    }

    if (hasError) return

    setSelectedIndex(1)
    if (customerName !== createdName || customerEmail !== createdEmail) {
      setCreatedEmail(customerEmail)
      setCreatedName(customerName)
      const res = await fetch("/.netlify/functions/stripe-create-customer", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerEmail,
          name: customerName,
        }),
      })
      const data = await res.json()
      setCustomerId(data.customer.id)
      const res2 = await addAbandonedCart(data.customer.id)
    }

    if (!hasFiredInitiateCheckout) {
      let eventID = uuidv4()
      const capi = await conversionsAPI(eventID, "InitiateCheckout")
      if (isBrowser && window.fbq)
        window.fbq("track", "InitiateCheckout", {}, { eventID: eventID })
      setHasFiredInitiateCheckout(true)
    }
  }

  const handleTabChange = index => {
    if (index === 0) setSelectedIndex(index)
    else goToTab2()
    // setSelectedIndex(index)
  }

  return (
    <Layout
      hasBanner={isUrgencyBannerOpen}
      isMidiCrateCheckout
      hideCart
      isPlayerOpen={currentSongIndex !== -1}
    >
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
            <div className="w-full md:w-auto">
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
            <div className="w-full px-2 mt-4 md:mt-0 md:w-auto sm:px-0">
              <h3 className="text-xl font-bold tracking-wide text-center md:text-justify sm:tracking-normal lg:text-4xl text-brand-teal">
                <span id="pricingsection">Complete Your Order:</span>
              </h3>
              <div className="px-4 pt-4 pb-6 mt-6 shadow-2xl bg-brand-tealTranslucent shadow-brand-tealShadow">
                <Tab.Group
                  manual
                  selectedIndex={selectedIndex}
                  onChange={index => handleTabChange(index)}
                >
                  <Tab.List className="flex justify-around font-bold leading-10">
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-l-lg bg-brand-dark border-r-2 border-brand-tealShadow focus:outline-none shadow-md ${
                          selected
                            ? "shadow-brand-teal"
                            : "shadow-brand-tealShadow"
                        }`
                      }
                    >
                      {({ selected }) => (
                        /* Use the `selected` state to conditionally style the selected tab. */
                        <span
                          className={
                            selected
                              ? " text-brand-teal border-b-2 border-brand-teal"
                              : " text-white"
                          }
                        >
                          1. Your Info
                        </span>
                      )}
                    </Tab>
                    <Tab
                      onClick={() => goToTab2()}
                      className={({ selected }) =>
                        `w-full rounded-r-lg bg-brand-dark focus:outline-none shadow-md ${
                          selected
                            ? "shadow-brand-teal"
                            : "shadow-brand-tealShadow"
                        }`
                      }
                    >
                      {({ selected }) => (
                        /* Use the `selected` state to conditionally style the selected tab. */
                        <span
                          className={
                            selected
                              ? " text-brand-teal border-b-2 border-brand-teal"
                              : " text-white"
                          }
                        >
                          2. Get Access
                        </span>
                      )}
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <div className="">
                        <input
                          value={customerName}
                          style={{ backgroundColor: "rgb(48, 49, 61)" }}
                          className={`w-full px-3 py-4 mt-6 text-white placeholder-white transition duration-150 ease-in-out border rounded-md outline-none focus:shadow-formLight ${
                            isFormNameError
                              ? "shadow-formError border-brand-formError"
                              : "shadow-formDark border-brand-formInputNormalBorder"
                          } focus:outline-none focus:border-brand-formInputBorder`}
                          placeholder="Your First Name"
                          type="text"
                          onKeyDown={e => {
                            if (e.key === "Enter") goToTab2()
                          }}
                          onChange={e => {
                            setIsFormNameError(false)
                            setCustomerName(e.target.value)
                          }}
                        />
                        {isFormNameError && (
                          <p className="-mb-6 text-brand-formError">
                            Please enter your first name
                          </p>
                        )}
                        <br />
                        <input
                          value={customerEmail}
                          onKeyDown={e => {
                            if (e.key === "Enter") goToTab2()
                          }}
                          style={{ backgroundColor: "rgb(48, 49, 61)" }}
                          className={`w-full px-3 py-4 mt-3 text-white placeholder-white transition duration-150 ease-in-out border rounded-md outline-none focus:shadow-formLight ${
                            isFormEmailError
                              ? "shadow-formError border-brand-formError"
                              : "shadow-formDark border-brand-formInputNormalBorder"
                          } focus:outline-none focus:border-brand-formInputBorder`}
                          placeholder="Your Email Address"
                          type="email"
                          onChange={e => {
                            setIsFormEmailError(false)
                            setCustomerEmail(e.target.value)
                          }}
                        />
                        {isFormEmailError && (
                          <p className="-mb-3 text-brand-formError">
                            Please enter a valid email address
                          </p>
                        )}
                        <button
                          className={`bg-brand-teal hover:bg-teal-300 whitespace-nowrap transition mx-auto flex justify-center ease-in-out hover:scale-110 duration-200 px-16 py-2 mt-6 text-base md:text-lg text-white font-bold rounded-full`}
                          type="button"
                          onClick={() => goToTab2()}
                        >
                          GO TO STEP 2
                        </button>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="">
                        <p className="mt-4 mb-4 font-bold leading-10 text-center text-white sm:mt-6">
                          First Month Free, Then Only $9/Month
                        </p>
                        <div className="flex justify-center">
                          <div>
                            <TfiLock className="w-8 h-6 transform -translate-y-0.5 text-brand-teal" />
                          </div>
                          <div>
                            <p className="mb-4 font-bold text-center text-brand-teal">
                              Secure Checkout
                            </p>
                          </div>
                        </div>
                        <Elements stripe={stripePromise} options={options}>
                          <MidiCrateCheckoutForm
                            customerId={customerId}
                            customerName={customerName}
                            customerEmail={customerEmail}
                          />
                        </Elements>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
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

export const Head = () => <Seo title="MIDI Crate Checkout" />

export default MidiCrateCheckoutPage
