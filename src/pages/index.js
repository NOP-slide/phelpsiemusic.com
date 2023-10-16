import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { useSiteContext } from "../hooks/use-site-context";

import Layout from "../components/layout"
import Seo from "../components/seo"

import { MdPlayArrow, MdPause } from "react-icons/md"
import {
  AiOutlineYoutube,
  AiFillYoutube,
  AiOutlineInstagram,
} from "react-icons/ai"
import AudioPlayer from "../components/AudioPlayer"

import { demoTracks } from "../data/demo-tracks"
import { addToCart } from "../functions/addToCart"

const IndexPage = () => {
  async function stripeCheckout() {
    try {
      const res = await fetch("/.netlify/functions/stripe-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ eventType: 'Contact', context:'123' }),
        body: null,
      })
      const data = await res.json()
      console.log("Return from netlify functions =", data)
      window.location = data.url
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const {setIsCartOpen} = useSiteContext();

  const currentSong = demoTracks[currentSongIndex]

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
        onClick={() => stripeCheckout()}
      >
        Hello
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
          demoTracks={demoTracks}
          key={currentSongIndex}
          currentSong={currentSong}
          songCount={demoTracks.length}
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
