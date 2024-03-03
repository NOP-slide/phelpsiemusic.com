import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"
import { MdOutlineTimer } from "react-icons/md"

const Banner = () => {
  return (
    <div
      id="thebanner"
      className={`banner-slidein sticky top-0 z-10 w-full pt-2 pb-1.5 md:pb-2 text-sm font-bold text-center text-white bg-red-700 md:text-lg`}
    >
      <p className="">
        Special Launch Offer: First Month FREE.
        <br />
        360 MIDI Files - Don't Miss Out!
        <MdOutlineTimer className="ml-1 inline-block w-5 h-5 md:w-6 md:h-6 transform -translate-y-0.5" />
      </p>
    </div>
  )
}

export default Banner
