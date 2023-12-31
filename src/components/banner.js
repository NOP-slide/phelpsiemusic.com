import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"

const Banner = () => {
  return (
    <div id="thebanner" className={`fixed top-0 z-10 w-full py-2 text-xs font-bold text-center text-white bg-red-700 md:text-lg`}>
      <p>Get 10% off your first order! Use code WELCOME at checkout</p>
    </div>
  )
}

export default Banner
