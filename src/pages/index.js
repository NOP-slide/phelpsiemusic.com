import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

import { MdPlayArrow, MdPause } from 'react-icons/md';
import AudioPlayer from '../AudioPlayer';

import { songs } from '../songs';

const IndexPage = () => { 
  async function stripeCheckout() {
    try {
      const res = await fetch('/.netlify/functions/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ eventType: 'Contact', context:'123' }),
        body: null, 
      });
      const data = await res.json();
      console.log('Return from netlify functions =', data);
      window.location = data.url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1);

  const currentSong = songs[currentSongIndex];
  
  return (
  <Layout>
    <div>
      <StaticImage
        src="../images/example.png"
        loading="eager"
        width={64}
        quality={95}
        formats={["auto", "webp", "avif"]}
        alt=""
        style={{ marginBottom: `var(--space-3)` }}
      />
      <button className='p-24 text-4xl text-red-600 bg-blue-600 ' type="button" onClick={()=>stripeCheckout()}>Hello</button>

      <div className="flex flex-col h-full bg-slate-800 text-slate-300">
      <div className="container flex-1 px-6 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold">My Audio Player</h1>
        <ul>
          {songs.map((song, index) => (
            <li key={song.title} className="mb-1">
              <button
                onClick={() => setCurrentSongIndex(index)}
                className={`flex items-center py-4 px-3  w-full space-evenly rounded ${
                  currentSongIndex === index
                    ? 'bg-amber-600 text-white'
                    : ' hover:bg-amber-600 hover:text-white'
                }`}
              >
                <span className="text-sm">
                  {index + 1 < 10 ? '0' + (index + 1) : index + 1}
                </span>
                <h2 className="flex-1">{song.title}</h2>
                <span>
                  {index === currentSongIndex ? (
                    <MdPause size={20} />
                  ) : (
                    <MdPlayArrow size={20} />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <AudioPlayer
          key={currentSongIndex}
          currentSong={currentSong}
          songCount={songs.length}
          songIndex={currentSongIndex}
          onNext={() => setCurrentSongIndex((i) => i + 1)}
          onPrev={() => setCurrentSongIndex((i) => i - 1)}
        />
      </div>
    </div>

    </div>
  </Layout>
);}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
