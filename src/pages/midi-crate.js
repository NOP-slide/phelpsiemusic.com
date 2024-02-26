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
import { navigate } from "gatsby"

const MidiCratePage = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false)
  const isBrowser = typeof window !== "undefined"
  const currentSong = allProducts[currentSongIndex]
  // console.log(currentSong);

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

    navigate("/midi-crate-checkout")
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

  // Lazy load videos
  React.useEffect(() => {
    let img1 = document.getElementById("placeholder1")
    let lazyContainer1 = document.getElementById("lazy1")
    let img2 = document.getElementById("placeholder2")
    let lazyContainer2 = document.getElementById("lazy2")
    let img3 = document.getElementById("placeholder3")
    let lazyContainer3 = document.getElementById("lazy3")

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    }

    let observer1 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // remove the img
          lazyContainer1.removeChild(img1)
          // create a video instead
          const videoElement1 = document.createElement("video")
          videoElement1.src = "/step1.mp4"
          videoElement1.alt = "Step 1"
          videoElement1.poster = "/placeholder1.jpg"
          videoElement1.className = "w-full px-2 mt-2 md:w-1/2"
          videoElement1.autoplay = true
          videoElement1.playsInline = true
          videoElement1.loop = true
          videoElement1.muted = true
          // swap it in for the img
          lazyContainer1.appendChild(videoElement1)
          // load video
          videoElement1.load()
          // disconnect observer
          observer1.unobserve(img1)
        }
      })
    }, options)

    observer1.observe(img1)

    let observer2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // remove the img
          lazyContainer2.removeChild(img2)
          // create a video instead
          const videoElement2 = document.createElement("video")
          videoElement2.src = "/step2.mp4"
          videoElement2.alt = "Step 2"
          videoElement2.poster = "/placeholder2.jpg"
          videoElement2.className = "w-full px-2 mt-2 md:w-1/2"
          videoElement2.autoplay = true
          videoElement2.playsInline = true
          videoElement2.loop = true
          videoElement2.muted = true
          // swap it in for the img
          lazyContainer2.appendChild(videoElement2)
          // load video
          videoElement2.load()
          // disconnect observer
          observer2.unobserve(img2)
        }
      })
    }, options)

    observer2.observe(img2)

    let observer3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // remove the img
          lazyContainer3.removeChild(img3)
          // create a video instead
          const videoElement3 = document.createElement("video")
          videoElement3.src = "/step3.mp4"
          videoElement3.alt = "Step 3"
          videoElement3.poster = "/placeholder3.jpg"
          videoElement3.className = "w-full px-2 mt-2 md:w-1/2"
          videoElement3.autoplay = true
          videoElement3.playsInline = true
          videoElement3.loop = true
          videoElement3.muted = true
          // swap it in for the img
          lazyContainer3.appendChild(videoElement3)
          // load video
          videoElement3.load()
          // disconnect observer
          observer3.unobserve(img3)
        }
      })
    }, options)

    observer3.observe(img3)
  }, [])

  return (
    <Layout hideCart isPlayerOpen={currentSongIndex !== -1}>
      {/* Hero section */}
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
            Your Shortcut To Hits. <br className="block lg:hidden" />
            Every Single Month.
          </h2>
        </div>
      </div>

      {/* Product section */}
      <div className="w-full bg-brand-dark">
        <div className="flex w-full h-full max-w-[22rem] gap-4 sm:gap-4 sm:max-w-xl mx-auto mt-12 md:max-w-2xl lg:max-w-[60rem] xl:max-w-5xl md:mt-16 lg:gap-10">
          <div className="relative w-1/2 px-0 lg:px-12">
            <div
              onClick={() => {
                setIsPaused(true)
                setVideoPlayerSrc("/midi-crate-video.mp4")
                setIsVideoPlayerOpen(true)
              }}
              className="relative cursor-pointer"
            >
              <StaticImage
                quality={95}
                src="../images/products/midi-crate-art-vidoutline.jpg"
                placeholder="blurred"
                alt=""
                className={` w-full h-48 sm:h-64 md:h-72 lg:h-[22rem]`}
              />
              <button
                className="absolute text-white duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 opacity-80 hover:scale-110 top-1/2 left-1/2"
                type="button"
                // onClick={() => {
                //   setIsPaused(true)
                //   setVideoPlayerSrc("/midi-crate-video.mp4")
                //   setIsVideoPlayerOpen(true)
                // }}
              >
                <MdPlayArrow className="w-16 h-14 md:w-24 md:h-20 bg-brand-teal checkout-loading" />
              </button>
            </div>
          </div>
          <div className="lg:block hidden border-l border-white h-48 sm:h-64 lg:h-[22rem]"></div>
          <div className="relative w-1/2 px-0 lg:px-12">
            <div className="flex flex-col py-4 sm:py-0">
              <p className="max-w-[10rem] sm:max-w-[10rem] md:max-w-[19rem] text-base font-bold text-white md:text-2xl lg:text-3xl">
                MIDI Crate - Monthly Chord Progressions & Arpeggios
              </p>
              {/* <div className="flex items-center mt-2">
                <p className="px-3 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full md:text-sm">
                  ${allProducts[1].oldPrice}
                </p>
                <p className="ml-2 text-lg font-bold md:text-2xl text-brand-teal">
                  ${allProducts[1].price}
                </p>
              </div> */}
              <div className="flex items-center">
                <button
                  type="button"
                  id="productplaybutton"
                  onClick={e => {
                    const anchor = document.querySelector("#audiodemos")
                    anchor.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    })
                    // if (currentSongIndex !== 2) {
                    //   e.stopPropagation()
                    //   setCurrentSongIndex(2)
                    //   setIsPaused(false)
                    // }
                    // if (currentSongIndex === 2) {
                    //   e.stopPropagation()
                    //   setIsPaused(!isPaused)
                    // }
                  }}
                  className="h-24 text-white"
                >
                  <MdPlayArrow
                    id="productplaybutton"
                    className="w-10 h-10 p-2 transition duration-200 ease-in-out rounded-full md:w-12 md:h-12 lg:w-14 lg:h-14 play-button hover:scale-110"
                  />
                </button>
                <p
                  onClick={e => {
                    const anchor = document.querySelector("#audiodemos")
                    anchor.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    })
                  }}
                  className="ml-3 text-sm font-bold text-white md:text-lg lg:text-xl"
                >
                  Audio Demos
                </p>
              </div>
              <button
                type="button"
                onClick={() => openPopup()}
                className={`hidden w-2/3 py-3 mt-3 text-xs font-bold text-white rounded-full sm:block lg:mt-6 sm:text-sm md:text-lg lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300 ${
                  isCheckoutLoading ? "checkout-loading" : ""
                }`}
              >
                GET MY FREE TRIAL
              </button>
              {/* <p className="hidden mt-3 text-xs text-gray-400 md:text-sm sm:block">
                Try It Risk-Free. Cancel anytime with 1 click
              </p> */}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => openPopup()}
          className={`block w-full max-w-[18rem] sm:max-w-sm py-3 mx-auto mt-2 text-sm font-bold text-white rounded-full sm:hidden lg:mt-6 sm:text-sm md:text-lg lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300 ${
            isCheckoutLoading ? "checkout-loading" : ""
          }`}
        >
          GET MY FREE TRIAL
        </button>
        {/* <p className="block mt-3 text-xs text-center text-gray-400 md:text-sm sm:hidden">
          Try It Risk-Free. Cancel anytime with 1 click
        </p> */}
      </div>

      {/* Who I've worked with section */}
      <div className="w-full pt-4 pb-20 md:pt-12 bg-brand-dark">
        <div className="flex flex-col w-full bg-brand-dark mx-auto max-w-[22rem] sm:max-w-xl md:max-w-2xl lg:max-w-[60rem] xl:max-w-5xl">
          <h3 className="mt-12 text-2xl font-bold tracking-wide text-center sm:tracking-normal lg:text-4xl text-brand-teal">
            WHY YOU NEED IT
          </h3>
          <div className="px-2 mx-auto mt-6 text-white sm:mt-12 sm:px-0">
            <p className="text-lg font-bold lg:text-xl">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" /> The
              cure to your beat block
            </p>
            <p className="ml-5">Get inspired to create instantly</p>
            <p className="mt-6 text-lg font-bold lg:text-xl">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Drag and drop workflow
            </p>
            <p className="ml-5">
              With MIDIs carefully organized to allow for fast and easy
              production
            </p>
            <p className="mt-6 text-lg font-bold lg:text-xl">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Advanced chords and arpeggios
            </p>
            <p className="ml-5">With no music theory required</p>
            <p className="mt-6 text-lg font-bold lg:text-xl">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Make your beats stand out
            </p>
            <p className="ml-5">
              Get the edgy, unique sound you need to compete in today's music
              industry
            </p>
            <p className="mt-6 text-lg font-bold lg:text-xl">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Unleash your creativity
            </p>
            <p className="ml-5">
              With full flexibility to edit MIDIs and use your own sounds &
              instruments
            </p>
          </div>
          {/* Chord progressions section */}
          <h3
            id="audiodemos"
            className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal"
          >
            WHAT'S IN MIDI CRATE?
          </h3>
          <p className="px-2 mt-12 text-xl font-bold text-white underline sm:px-0">
            Chord Progressions With Personality
          </p>
          <p className="px-2 mt-6 text-white sm:px-0">
            The foundation upon which your track is built. Your choice of chords
            will determine the emotions evoked in your listeners, and
            professional results demand a delicate balance between tension and
            release, combined with a deep and nuanced understanding of musical
            harmony and harmonic rhythm. You won't need to pull out your music
            theory textbook though - just drag and drop one of the chord
            progressions in MIDI Crate, assign it to any sound you like, and
            start your next project with confidence.
          </p>
          <div className="grid grid-cols-2 grid-rows-3 mx-auto mt-6 gap-x-12 md:gap-x-24 lg:gap-x-36">
            <div className="">
              <PlayButton trackNum={2} title="Street Confessional" />
            </div>
            <div className="">
              <PlayButton trackNum={3} title="Tread Lightly" />
            </div>
            <div className="">
              <PlayButton trackNum={4} title="Funk You Up" />
            </div>
            <div className="">
              <PlayButton trackNum={5} title="Afternoon Delight" />
            </div>
            <div className="">
              <PlayButton trackNum={6} title="Hands In The Air" />
            </div>
            <div className="">
              <PlayButton trackNum={7} title="Not Coming Down" />
            </div>
          </div>
          <p className="px-2 mt-12 text-xl font-bold text-white underline sm:px-0">
            Jaw-Dropping Arpeggios
          </p>
          <p className="px-2 mt-6 text-white sm:px-0">
            From ethereal twinkling to the filthiest, most aggressive textures
            imaginable, arpeggios are the key to any musical atmosphere your
            mind could envision. Arpeggios are highly versatile and are suitable
            for any musical genre, from hip-hop to synthwave, orchestral to
            dubstep - you get the idea. Just drag and drop one of the arps from
            MIDI Crate, assign it to a sound, and instantly have the perfect
            filler or even focal point for your next track.
          </p>
          <div className="grid grid-cols-2 grid-rows-3 mx-auto mt-6 gap-x-12 md:gap-x-24">
            <div className="">
              <PlayButton trackNum={8} title="Time's Running Out" />
            </div>
            <div className="">
              <PlayButton trackNum={9} title="Dreaming Android" />
            </div>
            <div className="">
              <PlayButton trackNum={10} title="Frozen In Space" />
            </div>
            <div className="">
              <PlayButton trackNum={11} title="Dracula's Warehouse" />
            </div>
            <div className="">
              <PlayButton trackNum={12} title="Piano Recital" />
            </div>
            <div className="">
              <PlayButton trackNum={13} title="Hit 'Em With The Hard Stuff" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => openPopup()}
            className={`w-48 py-3 mx-auto mt-8 text-sm font-bold text-white rounded-full md:w-64 lg:mt-12 md:text-lg lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300 ${
              isCheckoutLoading ? "checkout-loading" : ""
            }`}
          >
            GET MY FREE TRIAL
          </button>
          {/* <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            WHO I'VE WORKED WITH
          </h3>
          <div className="flex mt-8 lg:mt-16">
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl italic font-bold text-gray-200 lg:text-3xl">
                CuBeatz
              </p>
              <p className="mt-4 text-sm font-semibold text-center text-gray-200 lg:text-lg">
                (Travis Scott, Drake, Nicki Minaj)
              </p>
            </div>
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl italic font-bold text-gray-200 lg:text-3xl">
                Ronny J
              </p>
              <p className="mt-4 text-sm font-semibold text-center text-gray-200 lg:text-lg">
                (Eminem, Kanye West)
              </p>
            </div>
          </div>
          <div className="flex mt-8 lg:mt-16">
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl italic font-bold text-gray-200 lg:text-3xl">
                Twysted Genius
              </p>
              <p className="mt-4 text-sm font-semibold text-center text-gray-200 lg:text-lg">
                (Lil Baby, Future, Moneybagg Yo)
              </p>
            </div>
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl italic font-bold text-gray-200 lg:text-3xl">
                Kid Hazel
              </p>
              <p className="mt-4 text-sm font-semibold text-center text-gray-200 lg:text-lg">
                (21 Savage, Coi Leray)
              </p>
            </div>
          </div> */}
          {/* IG screenshots section */}
          <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            HOW TO USE IT
          </h3>
          <div id="lazy1" className="relative flex flex-wrap mt-12">
            <div className="w-full px-6 mb-6 md:w-1/2 md:my-auto">
              <div className="text-xl font-bold text-center md:text-2xl text-brand-teal">
                <span className="">1. </span>
                <span className="">Open MIDI Crate</span>
              </div>
              <div className="mt-6 text-lg text-center text-white md:text-xl">
                And check out all the MIDI files + bonus content
              </div>
            </div>
            <img
              className="w-full px-2 mt-2 md:w-1/2"
              id="placeholder1"
              src="/placeholder1.jpg"
            />
          </div>
          <div id="lazy2" className="relative flex flex-wrap mt-12">
            <div className="w-full px-6 mb-6 md:w-1/2 md:my-auto">
              <div className="text-xl font-bold text-center md:text-2xl text-brand-teal">
                <span className="">2. </span>
                <span className="">Drag & Drop What You Need</span>
              </div>
              <div className="mt-6 text-lg text-center text-white md:text-xl">
                With full flexibility to edit notes and use your own sounds &
                instruments
              </div>
            </div>
            <img
              className="w-full px-2 mt-2 md:w-1/2"
              id="placeholder2"
              src="/placeholder2.jpg"
            />
          </div>
          <div id="lazy3" className="relative flex flex-wrap mt-12">
            <div className="w-full px-6 mb-6 md:w-1/2 md:my-auto">
              <div className="text-xl font-bold text-center md:text-2xl text-brand-teal">
                <span className="">3. </span>
                <span className="">Add Your Own Touch, And Press Play</span>
              </div>
              <div className="mt-6 text-lg text-center text-white md:text-xl">
                Turn the volume to 11, 'cause you just produced some heat 🔥🔥🔥
              </div>
            </div>
            <img
              className="w-full px-2 mt-2 md:w-1/2"
              id="placeholder3"
              src="/placeholder3.jpg"
            />
          </div>
          <button
            type="button"
            onClick={() => openPopup()}
            className={`w-48 py-3 mx-auto mt-8 text-sm font-bold text-white rounded-full md:w-64 lg:mt-12 md:text-lg lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300 ${
              isCheckoutLoading ? "checkout-loading" : ""
            }`}
          >
            GET MY FREE TRIAL
          </button>
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
          {/* <div className="relative px-2 mx-auto mt-12 sm:px-0">
            <StaticImage
              quality={95}
              src="../images/twysted-screenshot.jpg"
              placeholder="blurred"
              alt=""
              imgStyle={{ objectFit: "fill" }}
              className={`w-full sm:w-96 h-[24rem] sm:h-[30rem] mx-auto `}
            />
            <button
              className="absolute text-white duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 top-1/2 left-1/2"
              type="button"
              onClick={() => {
                setIsPaused(true)
                setVideoPlayerSrc("/twysted-ig-vertical.mp4")
                setIsVideoPlayerOpen(true)
              }}
            >
              <MdPlayArrow className="w-20 h-20 rounded-full bg-brand-teal checkout-loading" />
            </button>
          </div> */}
          <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            <span id="pricingsection">ARE YOU READY?</span>
          </h3>
          <p className="px-2 mt-12 text-xl font-bold text-white underline sm:px-0">
            Here's what you'll get:
          </p>
          <div className="px-2 mt-6 text-white sm:px-0">
            <p className="font-bold">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" /> 180
              MIDI Chord Progressions Every Month
            </p>
            <br />
            <p className="font-bold">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" /> 180
              MIDI Arpeggios Every Month
            </p>
            <br />
            <p className="font-bold">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Bonus - Free Hip-Hop Loop Kit
            </p>
            <br />
            <p className="font-bold">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Bonus - Access To My Discord Community
            </p>
            <div className="block md:hidden">
              {/* <p className="mx-auto mt-12 text-lg text-center text-white">
                <span className="font-bold">
                  First Month Free, Then Only
                  <br />
                  <span className="text-red-600 line-through"> $27 </span>
                  <span className="text-brand-teal">$9/Month</span>
                </span>
              </p> */}
              {/* <button
                type="button"
                onClick={() => openPopup()}
                className={`bg-brand-teal hover:bg-teal-300 whitespace-nowrap transition mx-auto flex justify-center ease-in-out hover:scale-110 duration-200 px-12 py-2 mt-6 text-base md:text-lg text-white font-bold rounded-full ${
                  isCheckoutLoading ? "checkout-loading" : ""
                }`}
              >
                GET MY FREE TRIAL
              </button> */}
              {/* <p className="max-w-[17rem] mx-auto mt-3 text-xs md:text-sm text-center text-gray-400 md:max-w-none">
                Try It Risk-Free. Cancel anytime with 1 click, no questions
                asked
              </p> */}
            </div>
            <br />
            Everything in MIDI Crate is{" "}
            <span className="font-bold">royalty-free</span>. Any money you make
            from tracks using MIDI Crate is yours to keep.
            <br />
            <br />
            All MIDI files work in{" "}
            <span className="font-bold">any audio software</span> (FL Studio,
            Ableton, Cubase, etc.), and work on both Windows & Mac OS.
            <br />
            <br />
            To start for free, and get the tools you need to make{" "}
            <span className="font-bold">hit-level beats</span>, simply click "
            <span className="font-bold">Get My Free Trial</span>".
          </div>
          <div className="">
            {/* <p className="mx-auto mt-12 text-lg text-center text-white">
              <span className="font-bold">
                First Month Free, Then Only
                <br />
                <span className="text-red-600 line-through"> $27 </span>
                <span className="text-brand-teal">$9/Month</span>
              </span>
            </p> */}
            <button
              type="button"
              onClick={() => openPopup()}
              className={`bg-brand-teal hover:bg-teal-300 whitespace-nowrap transition mx-auto flex justify-center ease-in-out hover:scale-110 duration-200 px-12 py-2 mt-8 text-base md:text-lg text-white font-bold rounded-full ${
                isCheckoutLoading ? "checkout-loading" : ""
              }`}
            >
              GET MY FREE TRIAL
            </button>
            {/* <p className="max-w-[17rem] mx-auto mt-3 text-xs md:text-sm text-center text-gray-400 md:max-w-none">
              Try It Risk-Free. Cancel anytime with 1 click, no questions asked
            </p> */}
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
      {/* Audio player section */}
      {isCrossSellModalOpen ? (
        <div
          className={`fixed bottom-0 py-2 flex z-50 flex-col w-full transform bg-brand-dark text-white ${
            playerZIndexBoost ? "player-shown" : "player-hidden"
          }`}
        >
          <AudioPlayerMidiCrate
            allProducts={allProducts}
            key={crossSellItemNum}
            isPaused={!playerZIndexBoost}
            setIsPaused={setIsPaused}
            currentSong={allProducts[crossSellItemNum]}
            songCount={allProducts.length}
            songIndex={crossSellItemNum}
            onNext={() => setCurrentSongIndex(i => i + 1)}
            onPrev={() => setCurrentSongIndex(i => i - 1)}
          />
        </div>
      ) : (
        <div
          className={`fixed bottom-0 py-2 flex z-20 flex-col w-full transform bg-brand-dark text-white ${
            currentSongIndex !== -1 ? "player-shown" : "player-hidden"
          }`}
        >
          <AudioPlayerMidiCrate
            allProducts={allProducts}
            key={currentSongIndex}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            currentSong={currentSong}
            songCount={allProducts.length}
            songIndex={currentSongIndex}
            onNext={() => setCurrentSongIndex(i => i + 1)}
            onPrev={() => setCurrentSongIndex(i => i - 1)}
          />
        </div>
      )}
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="MIDI Crate" />

export default MidiCratePage
