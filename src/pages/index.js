import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context";

import Layout from "../components/layout"
import Seo from "../components/seo"
import AudioPlayer from "../components/AudioPlayer"

import { allProducts } from "../data/all-products"
import { addToCart } from "../functions/addToCart"

const IndexPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const {setIsCartOpen} = useSiteContext();

  const currentSong = allProducts[currentSongIndex]

  return (
    <Layout isPlayerOpen={currentSongIndex !== -1}>
      <button
        className="p-24 text-4xl text-red-600 bg-blue-600 border border-black "
        type="button"
        onClick={() => setCurrentSongIndex(0)}
      >
        Play Demo 1
      </button>
      <button
        className="p-24 text-4xl text-red-600 bg-blue-600 border border-black "
        type="button"
        onClick={() => setCurrentSongIndex(1)}
      >
        Play Demo 2
      </button>
      <button
        className="p-24 mb-64 text-4xl text-red-600 bg-blue-600 border border-black "
        type="button"
        onClick={() => {
          addToCart();
          setIsCartOpen(true);
        }}
      >
        Add To Cart 1
      </button>

      <div className="w-full bg-gray-200 h-96" />
      <div
        className={`fixed bottom-0 py-2 flex z-20 flex-col w-full transform bg-brand-dark text-white ${
          currentSongIndex !== -1 ? "player-shown" : "player-hidden"
        }`}
      >
        <AudioPlayer
          allProducts={allProducts}
          key={currentSongIndex}
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
