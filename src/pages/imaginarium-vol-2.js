import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AudioPlayer from "../components/AudioPlayer"
import { MdPlayArrow, MdPause } from "react-icons/md"
import { IoStarSharp } from "react-icons/io5"
import { FaDiamond } from "react-icons/fa6"
import { TfiLock } from "react-icons/tfi"
import { useSiteContext } from "../hooks/use-site-context"

import { allProducts } from "../data/all-products"
import { v4 as uuidv4 } from 'uuid';

const ImaginariumVol2Page = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const isBrowser = typeof window !== "undefined"
  const currentSong = allProducts[currentSongIndex]

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
          content_name: allProducts[1].title,
        }),
      })
      const result = await res.json()
      console.log("Return from netlify functions conversionsAPI =", result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  const addToCart = () => {
    if (typeof localStorage !== undefined) {
      let tempCart = {
        items: [],
      }
      let eventID = uuidv4();
      conversionsAPI(eventID, "AddToCart")
      if (isBrowser && window.fbq)
        window.fbq("track", "AddToCart", {}, { eventID: eventID })

      // If cart already exists
      if (cartItemsFromLS.length > 0) {
        // If product is not already in cart
        if (!cartItemsFromLS.includes(allProducts[1].prodCode)) {
          tempCart = JSON.parse(cartItemsFromLS)
          tempCart.items.push(allProducts[1].prodCode)
          localStorage.setItem("phelpsieCart", JSON.stringify(tempCart))
          setCartItemsFromLS(JSON.stringify(tempCart))
        }
        // else make a new cart
      } else {
        tempCart.items.push(allProducts[1].prodCode)
        localStorage.setItem("phelpsieCart", JSON.stringify(tempCart))
        setCartItemsFromLS(JSON.stringify(tempCart))
      }
      console.log("Tempcart: ", tempCart)
    }

    if (allProducts[1].crossSellsWith) {
      if (!cartItemsFromLS.includes(allProducts[1].crossSellsWith)) {
        setCrossSellItem(allProducts[1].crossSellsWith)
        setCrossSellItemNum(allProducts[1].crossSellsWithNum)
        setTimeout(() => {
          setIsPaused(true)
          setIsCrossSellModalOpen(true)
        }, 400)
      }
    }

    setIsCartOpen(true)
  }

  React.useEffect(() => {
    let eventID = uuidv4();
    conversionsAPI(eventID, "ViewContent")
    if (isBrowser && window.fbq)
      window.fbq(
        "track",
        "ViewContent",
        { content_name: allProducts[1].title },
        { eventID: eventID }
      )
  }, [])

  return (
    <Layout isPlayerOpen={currentSongIndex !== -1}>
      {/* Hero section */}
      <div className="relative">
        <StaticImage
          quality={95}
          src="../images/northern-lights-2.jpg"
          placeholder="blurred"
          alt=""
          className="relative w-full h-36 sm:h-48"
        />
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <h2 className="text-2xl font-bold tracking-wide text-center text-white sm:tracking-normal sm:text-4xl xl:text-5xl whitespace-nowrap">
            Placement-Ready Loops. <br className="block lg:hidden" />
            Trusted By The Pros.
          </h2>
        </div>
      </div>

      {/* Product section */}
      <div className="w-full bg-brand-dark">
        <div className="flex w-full h-full max-w-[22rem] gap-4 sm:gap-4 sm:max-w-xl mx-auto mt-12 md:max-w-2xl lg:max-w-[60rem] xl:max-w-5xl md:mt-16 lg:gap-10">
          <div className="relative w-1/2 px-0 lg:px-12">
            <div className="relative">
              <StaticImage
                quality={95}
                src="../images/products/2-imaginarium-vol-2-art.jpg"
                placeholder="blurred"
                alt=""
                className={` transition ease-in-out duration-300 w-full h-48 sm:h-64 md:h-72 lg:h-[22rem]`}
              />
            </div>
          </div>
          <div className="lg:block hidden border-l border-white h-48 sm:h-64 lg:h-[22rem]"></div>
          <div className="relative w-1/2 px-0 lg:px-12">
            <div className="flex flex-col py-4 sm:py-0">
              <p className="max-w-[10rem] sm:max-w-[10rem] md:max-w-[19rem] text-base font-bold text-white md:text-2xl lg:text-3xl">
                {allProducts[1].title}
              </p>
              <div className="flex items-center mt-2">
                <p className="px-3 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full md:text-sm">
                  ${allProducts[1].oldPrice}
                </p>
                <p className="ml-2 text-lg font-bold md:text-2xl text-brand-teal">
                  ${allProducts[1].price}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  id="productplaybutton"
                  onClick={e => {
                    if (currentSongIndex !== 1) {
                      e.stopPropagation()
                      setCurrentSongIndex(1)
                      setIsPaused(false)
                    }
                    if (currentSongIndex === 1) {
                      e.stopPropagation()
                      setIsPaused(!isPaused)
                    }
                  }}
                  className="h-24 text-white"
                >
                  {isPaused === false && currentSongIndex === 1 ? (
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
                <p className="ml-3 text-sm font-bold text-white md:text-lg lg:text-xl">
                  Play Demo
                </p>
              </div>
              <button
                type="button"
                onClick={() => addToCart()}
                className="hidden w-2/3 py-3 mt-3 text-xs font-bold text-white rounded-full sm:block lg:mt-6 sm:text-sm md:text-lg lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => addToCart()}
          className="block w-full max-w-[18rem] sm:max-w-sm py-3 mx-auto mt-2 text-sm font-bold text-white rounded-full sm:hidden lg:mt-6 sm:text-sm md:text-lg lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300"
        >
          ADD TO CART
        </button>
      </div>

      {/* Who I've worked with section */}
      <div className="w-full pt-4 pb-20 md:pt-12 bg-brand-dark">
        <div className="flex flex-col w-full bg-brand-dark mx-auto max-w-[22rem] sm:max-w-xl md:max-w-2xl lg:max-w-[60rem] xl:max-w-5xl">
          <h3 className="mt-12 text-2xl font-bold tracking-wide text-center underline sm:tracking-normal lg:text-4xl text-brand-teal">
            WHY YOU NEED IT
          </h3>
          <div className="px-2 mx-auto mt-12 text-white sm:px-0">
            <p className="text-lg font-bold lg:text-xl">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" /> The
              cure to your beat block
            </p>
            <p className="ml-5">Get inspired to create instantly</p>
            <p className="mt-6 text-lg font-bold lg:text-xl">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Fast, easy workflow
            </p>
            <p className="ml-5">
              With stems carefully separated to allow for quick beat arrangement
            </p>
            <p className="mt-6 text-lg font-bold lg:text-xl">
              <FaDiamond className="inline-block w-3 h-3 text-brand-teal" />{" "}
              Advanced chords and melodies
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
              Sound your best
            </p>
            <p className="ml-5">
              With cutting edge sound design, real instruments, and professional
              mixing
            </p>
          </div>
          <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
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
          </div>
          {/* IG screenshots section */}
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
          <div className="relative px-2 mx-auto mt-12 sm:px-0">
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
          </div>
          <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            WHAT YOU'LL GET
          </h3>
          <p className="px-2 mt-12 text-xl font-bold text-white sm:px-0">
            Imaginarium Vol. 2 - Trap and Drill Loop Kit
          </p>
          <p className="px-2 mt-6 text-white sm:px-0">
            Enter a world of musical fantasy, ranging from epic choirs, ethnic
            strings and heavenly bells to silky nylon guitars, real whistling
            leads and much more. Featuring whimsical melodies and arrangements
            full of character, with a touch of melancholy throughout, this loop
            kit is sure to <span className="font-bold">inspire you</span> and
            leave your <span className="font-bold">listeners in awe.</span>
            <br />
            <br />
            Contains <span className="font-bold">50+</span> gorgeous instrument
            and sound effect stems, carefully arranged into ten original
            trap/drill compositions, in WAV format for use in any audio software
            (FL Studio, Ableton, Cubase, etc.), and any platform (Windows/Mac).
            <br />
            <br />
            All compositions are{" "}
            <span className="font-black">professionally mixed</span>, have A and
            B sections, and are made up of{" "}
            <span className="font-black">several layers</span>, perfectly
            designed to be added or removed as you please when arranging your
            track.
            <br />
            <br />
            As a <span className="font-black">special bonus</span>, this kit
            also includes a free additional loop.
            <br />
            <br />
            <span className="font-black">Royalty free</span> for online beat
            leasing (eg. Beatstars, Traktrain). Please read the included text
            file for full terms after purchase.
            <br />
            <br />
            To get your copy now, and start making{" "}
            <span className="font-black">industry level beats</span>, simply
            click "<span className="font-black">Add To Cart</span>".
          </p>
          <button
            type="button"
            onClick={() => addToCart()}
            className="w-48 py-3 mx-auto mt-8 text-sm font-bold text-white rounded-full md:w-64 lg:mt-12 md:text-lg lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300"
          >
            ADD TO CART
          </button>
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
          <AudioPlayer
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
          <AudioPlayer
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
export const Head = () => <Seo title="Imaginarium Vol. 2" />

export default ImaginariumVol2Page
