import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AudioPlayer from "../components/AudioPlayer"

import { allProducts } from "../data/all-products"
import { addToCart } from "../functions/addToCart"

const IndexPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const { setIsCartOpen } = useSiteContext()

  const currentSong = allProducts[currentSongIndex]

  return (
    <Layout isPlayerOpen={currentSongIndex !== -1}>
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
          <p className="max-w-lg text-lg text-white sm:text-xl">
            Want to make your beats sound professional? Want to get the
            attention of major producers and move your career forward? You're in
            the right place.
          </p>
        </div>
      </div>
      {/* <button
        className="p-24 text-4xl text-red-600 bg-blue-600 border border-black "
        type="button"
        onClick={() => setCurrentSongIndex(0)}
      >
        Play Demo 1
      </button>
      <button
        className="p-24 text-4xl text-red-600 bg-blue-600 border border-black "
        type="button"
        onClick={() => setIsPaused(!isPaused)}
      >
        Paused? : {isPaused.toString()}
      </button>
      <button
        className="p-24 mb-64 text-4xl text-red-600 bg-blue-600 border border-black "
        type="button"
        onClick={() => {
          addToCart()
          setIsCartOpen(true)
        }}
      >
        Add To Cart 1
      </button> */}

      {/* Product card section */}
      <div className="w-full bg-brand-dark">
        <div className="flex w-full max-w-5xl gap-16 mx-auto mt-16 h-[28rem]">
          <div className="w-1/2 p-4 bg-brand-tealDark">
            <StaticImage
              quality={95}
              src="../images/products/1-imaginarium-vol-1-art.jpg"
              placeholder="blurred"
              alt=""
              className="relative w-full h-full"
            />
          </div>
          <div className="w-1/2 p-4 bg-brand-tealDark">
            <StaticImage
              quality={95}
              src="../images/products/2-imaginarium-vol-2-art.jpg"
              placeholder="blurred"
              alt=""
              className="relative w-full h-full"
            />
          </div>
        </div>
      </div>

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
