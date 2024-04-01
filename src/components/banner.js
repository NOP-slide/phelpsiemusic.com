import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"
import { MdOutlineTimer } from "react-icons/md"

const Banner = () => {
  return (
    <div
      id="thebanner"
      className={`banner-slidein sticky top-0 z-10 w-full pt-2 pb-2 md:pb-2 text-sm font-bold text-center text-white crossSellBackground md:text-lg`}
    >
      <p className="">
        <span className="border-b border-white">
          Try It Risk-Free
        </span>
        <br />
        Your first month is 100% free.
        <br />
        Don't love it? Cancel in 1 click
        {/* <br />
        Don't love it? Cancel in 1 click. */}
        {/* <MdOutlineTimer className="ml-1 inline-block w-5 h-5 md:w-6 md:h-6 transform -translate-y-0.5" /> */}
      </p>
    </div>
  )
}

export default Banner
