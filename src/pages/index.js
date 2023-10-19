import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AudioPlayer from "../components/AudioPlayer"
import { MdPlayArrow, MdPause } from "react-icons/md"

import { allProducts } from "../data/all-products"
import { addToCart } from "../functions/addToCart"

const IndexPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isHoveringProd1, setIsHoveringProd1] = React.useState(false)
  const [isHoveringProd2, setIsHoveringProd2] = React.useState(false)
  const { setIsCartOpen } = useSiteContext()

  const currentSong = allProducts[currentSongIndex]

  return (
    <Layout isPlayerOpen={currentSongIndex !== -1}>
      {/* Hero section */}
      <div className="relative">
        <StaticImage
          quality={95}
          src="../images/northern-lights-2.jpg"
          placeholder="blurred"
          alt=""
          className="relative w-full h-80 sm:h-96"
        />
        <div className="absolute -translate-y-1/2 -translate-x-1/3 top-1/2 left-1/3">
          <h2 className="text-4xl font-bold text-white sm:text-6xl">
            Loop Kits
          </h2>
          <br />
          <p className="max-w-lg text-white text-md sm:text-xl">
            Want to make your beats sound professional? Ready to get the
            attention of major producers and move your career forward? Download
            pro-quality loops for the inspiration you need.
          </p>
        </div>
      </div>

      {/* Product card section */}
      <div className="w-full bg-brand-dark">
        <div className="flex w-full h-full max-w-[22rem] gap-0 mx-auto mt-4 md:max-w-5xl md:mt-16 lg:gap-16">
          <div
            onMouseEnter={() => setIsHoveringProd1(true)}
            onMouseLeave={() => setIsHoveringProd1(false)}
            className="relative w-1/2 p-2 md:p-4 bg-brand-tealDark hover:cursor-pointer"
          >
            <div className="relative">
              <StaticImage
                quality={95}
                src="../images/products/1-imaginarium-vol-1-art.jpg"
                placeholder="blurred"
                alt=""
                className={` transition ease-in-out duration-300 w-full h-48 lg:h-[28rem] ${
                  isHoveringProd1 && "brightness-75"
                }`}
              />
              <button
                type="button"
                className={`${
                  isHoveringProd1 ? "opacity-100" : "opacity-0"
                } transition ease-in-out duration-500 absolute px-4 text-sm md:px-16 py-1 md:py-3 md:text-lg font-bold text-white -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 whitespace-nowrap sm:py-4 bg-brand-teal`}
              >
                LEARN MORE
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentSongIndex !== 0) {
                    setCurrentSongIndex(0)
                    setIsPaused(false)
                  }
                  if (currentSongIndex === 0) setIsPaused(!isPaused)
                }}
                className="h-24 text-white"
              >
                {isPaused === false && currentSongIndex === 0 ? (
                  <MdPause className="absolute w-12 h-12 p-2 transition duration-200 ease-in-out rounded-full checkout-loading bottom-4 right-4 md:bottom-8 md:right-8 hover:scale-110" />
                ) : (
                  <MdPlayArrow className="absolute w-12 h-12 p-2 transition duration-200 ease-in-out rounded-full play-button bottom-4 right-4 md:bottom-8 md:right-8 hover:scale-110" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-6 mb-3">
              <p className="max-w-[6rem] text-sm font-bold text-white sm:text-base">
                {allProducts[0].title}
              </p>
              <div className="flex flex-col gap-1">
                <p className="px-2 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full sm:text-sm">
                  ${allProducts[0].oldPrice}
                </p>
                <p className="px-2 text-lg font-bold sm:text-xl text-brand-teal">
                  ${allProducts[0].price}
                </p>
              </div>
            </div>
          </div>
          <div
            onMouseEnter={() => setIsHoveringProd2(true)}
            onMouseLeave={() => setIsHoveringProd2(false)}
            className="relative w-1/2 p-2 md:p-4 bg-brand-tealDark hover:cursor-pointer"
          >
            <div className="relative">
              <StaticImage
                quality={95}
                src="../images/products/2-imaginarium-vol-2-art.jpg"
                placeholder="blurred"
                alt=""
                className={` transition ease-in-out duration-300 w-full h-48 lg:h-[28rem] ${
                  isHoveringProd2 && "brightness-75"
                }`}
              />
              <button
                type="button"
                className={`${
                  isHoveringProd2 ? "opacity-100" : "opacity-0"
                } transition ease-in-out duration-500 absolute px-4 text-sm md:px-16 py-1 md:py-3 md:text-lg font-bold text-white -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 whitespace-nowrap sm:py-4 bg-brand-teal`}
              >
                LEARN MORE
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentSongIndex !== 1) {
                    setCurrentSongIndex(1)
                    setIsPaused(false)
                  }
                  if (currentSongIndex === 1) setIsPaused(!isPaused)
                }}
                className="h-24 text-white"
              >
                {isPaused === false && currentSongIndex === 1 ? (
                  <MdPause className="absolute w-12 h-12 p-2 transition duration-200 ease-in-out rounded-full checkout-loading bottom-4 right-4 md:bottom-8 md:right-8 hover:scale-110" />
                ) : (
                  <MdPlayArrow className="absolute w-12 h-12 p-2 transition duration-200 ease-in-out rounded-full play-button bottom-4 right-4 md:bottom-8 md:right-8 hover:scale-110" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-6 mb-3">
              <p className="max-w-[6rem] text-sm font-bold text-white sm:text-base">
                {allProducts[1].title}
              </p>
              <div className="flex flex-col gap-1">
                <p className="px-2 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full sm:text-sm">
                  ${allProducts[1].oldPrice}
                </p>
                <p className="px-2 text-lg font-bold sm:text-xl text-brand-teal">
                  ${allProducts[1].price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio player section */}
      <div className="w-full bg-brand-dark h-96" />
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
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
