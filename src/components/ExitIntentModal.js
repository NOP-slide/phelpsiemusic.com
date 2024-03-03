import * as React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { GatsbyImage } from "gatsby-plugin-image"
import { useSiteContext } from "../hooks/use-site-context"
import { useOutsideClick } from "../hooks/use-outside-click"
import { CgSpinner } from "react-icons/cg"
import { HiOutlineShoppingCart } from "react-icons/hi"
import VideoProgressBar from "./VideoProgressBar"
import {
  MdClose,
  MdPlayArrow,
  MdPause,
  MdVolumeOff,
  MdVolumeUp,
  MdStop,
} from "react-icons/md"
import { allProducts } from "../data/all-products"

const ExitIntentModal = () => {
  const [modalOpen, setModalOpen] = React.useState(true)
  const [isPlayingModalAudio, setIsPlayingModalAudio] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)
  const [emailAddress, setEmailAddress] = React.useState("")
  const [isValidEmail, setIsValidEmail] = React.useState(null)
  const [isInputBlinking, setIsInputBlinking] = React.useState(null)
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false)
  const {
    setIsCrossSellModalOpen,
    crossSellItem,
    crossSellItemNum,
    setPlayerZIndexBoost,
    playerZIndexBoost,
    cartItemsFromLS,
    setCartItemsFromLS,
    setIsExitIntentModalOpen,
    isUserAFK,
    setIsUserAFK,
  } = useSiteContext()

  return (
    <div
      className={`cart-modal-container transform ${
        modalOpen ? "cart-modal-fadein" : "cart-modal-fadeout"
      }`}
    >
      <div
        className={`fixed pb-6 md:pb-12 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl top-6 -translate-y-0 md:top-1/3 left-1/2 -translate-x-1/2 md:-translate-y-1/3 bg-brand-dark ${
          modalOpen ? "cross-sell-modal-fadein" : "cross-sell-modal-fadeout"
        }`}
      >
        <div className="relative w-full h-full">
          <MdClose
            onClick={() => {
              setModalOpen(false)
              setTimeout(() => setIsExitIntentModalOpen(false), 350)
            }}
            className="absolute text-white cursor-pointer md:text-lg lg:text-xl top-2 right-2"
          />
          <div className="flex items-center justify-center w-full h-16 md:h-24 crossSellBackground">
            <h2 className="max-w-[16rem] sm:max-w-sm text-xl font-bold text-center text-white md:text-2xl md:max-w-xl">
              {isUserAFK ? "Are You Still There?" : "Don't Miss Out!"}
            </h2>
          </div>
          <div className="px-2 mt-6 text-xl font-bold text-center md:px-0 md:mt-8 md:text-3xl text-brand-teal">
            <span className="">Today's Total: $0.00</span>
            <br className="" />
            <br className="hidden md:block" />
            <div className="mt-4 text-white md:mt-0">
              Are you sure you don't want
              <br />
              your 360 free MIDI files?
            </div>
          </div>
          <button
            className={`bg-brand-teal hover:bg-teal-300 whitespace-nowrap transition mx-auto flex justify-center ease-in-out hover:scale-110 duration-200 px-12 py-2 mt-8 md:mt-12 text-base md:text-lg text-white font-bold rounded-full ${
              isCheckoutLoading ? "checkout-loading" : ""
            }`}
            type="button"
            onClick={() => {
              setModalOpen(false)
              setTimeout(() => setIsExitIntentModalOpen(false), 350)
            }}
          >
            YES, I WANT THEM
          </button>
          <button
            className={`bg-red-900 whitespace-nowrap mx-auto flex justify-center px-12 py-2 mt-4 md:mt-6 text-base md:text-lg text-white font-bold rounded-full ${
              isCheckoutLoading ? "checkout-loading" : ""
            }`}
            type="button"
            onClick={() => {
              setModalOpen(false)
              setTimeout(() => setIsExitIntentModalOpen(false), 350)
            }}
          >
            NO THANK YOU
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExitIntentModal
