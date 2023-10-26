import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AudioPlayer from "../components/AudioPlayer"
import { MdPlayArrow, MdPause } from "react-icons/md"
import { useSiteContext } from "../hooks/use-site-context"

import { allProducts } from "../data/all-products"

const ImaginariumVol1Page = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const isBrowser = typeof window !== "undefined"
  const currentSong = allProducts[currentSongIndex]

  const {
    setIsVideoPlayerOpen,
    isVideoPlayerOpen,
    setIsCartOpen,
    cartItemsFromLS,
    setCartItemsFromLS,
    isCrossSellModalOpen,
    setIsCrossSellModalOpen,
    setCrossSellItem,
    crossSellItem,
    setCrossSellItemNum,
    crossSellItemNum,
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
          content_name: allProducts[0].title,
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
      let eventID = crypto.randomUUID();
      conversionsAPI(eventID, "AddToCart");
      if (isBrowser && window.fbq) window.fbq('track', 'AddToCart', {}, { eventID: eventID });

      // If cart already exists
      if (cartItemsFromLS.length > 0) {
        // If product is not already in cart
        if (!cartItemsFromLS.includes(allProducts[0].prodCode)) {
          tempCart = JSON.parse(cartItemsFromLS)
          tempCart.items.push(allProducts[0].prodCode)
          localStorage.setItem("phelpsieCart", JSON.stringify(tempCart))
          setCartItemsFromLS(JSON.stringify(tempCart))
        }
        // else make a new cart
      } else {
        tempCart.items.push(allProducts[0].prodCode)
        localStorage.setItem("phelpsieCart", JSON.stringify(tempCart))
        setCartItemsFromLS(JSON.stringify(tempCart))
      }
      console.log("Tempcart: ", tempCart)
    }

    if (allProducts[0].crossSellsWith) {
      if (!cartItemsFromLS.includes(allProducts[0].crossSellsWith)) {
        setCrossSellItem(allProducts[0].crossSellsWith)
        setCrossSellItemNum(allProducts[0].crossSellsWithNum)
        setTimeout(() => {
          setIsPaused(true)
          setIsCrossSellModalOpen(true)
        }, 400)
      }
    }

    setIsCartOpen(true)
  }

  console.log(playerZIndexBoost)

  React.useEffect(() => {
    let eventID = crypto.randomUUID();
    conversionsAPI(eventID, "ViewContent");
    if (isBrowser && window.fbq) window.fbq('track', 'ViewContent', {content_name: allProducts[0].title}, { eventID: eventID });
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
                src="../images/products/1-imaginarium-vol-1-art.jpg"
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
                {allProducts[0].title}
              </p>
              <div className="flex items-center mt-2">
                <p className="px-3 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full md:text-sm">
                  ${allProducts[0].oldPrice}
                </p>
                <p className="ml-2 text-lg font-bold md:text-2xl text-brand-teal">
                  ${allProducts[0].price}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  id="productplaybutton"
                  onClick={e => {
                    if (currentSongIndex !== 0) {
                      e.stopPropagation()
                      setCurrentSongIndex(0)
                      setIsPaused(false)
                    }
                    if (currentSongIndex === 0) {
                      e.stopPropagation()
                      setIsPaused(!isPaused)
                    }
                  }}
                  className="h-24 text-white"
                >
                  {isPaused === false && currentSongIndex === 0 ? (
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
          <h3 className="mt-12 text-2xl font-bold tracking-wide text-center sm:tracking-normal lg:text-4xl text-brand-teal">
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
            Imaginarium Vol. 1 - Trap and Drill Loop Kit
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
            also includes an additional fingerstyle and electric guitar loop.
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
        </div>
      </div>
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
            currentSong={allProducts[crossSellItemNum]
            }
            songCount={allProducts.length}
            songIndex={crossSellItemNum
            }
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
export const Head = () => <Seo title="Imaginarium Vol. 1" />

export default ImaginariumVol1Page
