import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { navigate } from "gatsby"

const NotFoundPage = () => {
  const videoRef = React.useRef(null)
  const [volume, setVolume] = React.useState(1.0)

  const handleMuteUnmute = () => {
    if (!videoRef.current) return

    console.log(videoRef);

    if (videoRef.current.volume !== 0) {
      videoRef.current.volume = 0;
      
    } else {
      videoRef.current.volume = 1.0
    }
  }

  return (
    <Layout>
      <div className="my-auto">
        <h2 className="mx-auto text-3xl font-bold text-center sm:text-4xl text-brand-teal">
          404: Page Not Found
        </h2>
        <button
          type="button"
          onClick={() => {handleMuteUnmute(); console.log("Volume: ", volume)}}
          className="flex items-center justify-center px-4 py-1 mx-auto mt-6 text-xl font-bold text-white rounded-full bg-brand-teal"
        >
          Back To Shop
        </button>
        <video
          ref={videoRef}
          onVolumeChange={e => setVolume(e.currentTarget.volume)}
          className="w-full h-96 bg-brand-dark"
          preload="auto"
          src="/twysted-ig-vertical.mp4"
        />
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
