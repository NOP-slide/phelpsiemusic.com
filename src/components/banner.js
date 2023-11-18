import * as React from "react"
import { useSiteContext } from "../hooks/use-site-context"

const Banner = () => {
  return (
    <div id="thebanner" className={`w-full py-2 text-sm font-bold text-center text-white bg-red-700 md:text-lg`}>
      <p>Get 10% off your first order! Use code WELCOME at checkout</p>
    </div>
  )
}

export default Banner
