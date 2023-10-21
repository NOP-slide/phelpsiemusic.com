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

const CrossSellModal = () => {
  const [modalOpen, setModalOpen] = React.useState(true)
  const [isPlayingModalAudio, setIsPlayingModalAudio] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)
  const {
    setIsCrossSellModalOpen,
    crossSellItem,
    crossSellItemNum,
    setPlayerZIndexBoost,
    playerZIndexBoost,
    cartItemsFromLS,
    setCartItemsFromLS,
  } = useSiteContext()

  const addToCart = () => {
    if (typeof localStorage !== undefined) {
      let tempCart = {
        items: [],
      }

      // If cart already exists
      if (cartItemsFromLS.length > 0) {
        // If product is not already in cart
        if (!cartItemsFromLS.includes(allProducts[crossSellItemNum].prodCode)) {
          tempCart = JSON.parse(cartItemsFromLS)
          tempCart.items.push(allProducts[crossSellItemNum].prodCode)
          localStorage.setItem("phelpsieCart", JSON.stringify(tempCart))
          setCartItemsFromLS(JSON.stringify(tempCart))
        }
        // else make a new cart
      } else {
        tempCart.items.push(allProducts[crossSellItemNum].prodCode)
        localStorage.setItem("phelpsieCart", JSON.stringify(tempCart))
        setCartItemsFromLS(JSON.stringify(tempCart))
      }
      setModalOpen(false)
      setPlayerZIndexBoost(false)
      setTimeout(() => setIsCrossSellModalOpen(false), 350)
    }
  }

  const imageData = useStaticQuery(graphql`
    {
      allFile(
        filter: { relativeDirectory: { eq: "products" } }
        sort: { name: ASC }
      ) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED, quality: 95)
            }
            name
          }
        }
      }
    }
  `)

  return (
    <div
      className={`cart-modal-container transform ${
        modalOpen ? "cart-modal-fadein" : "cart-modal-fadeout"
      }`}
    >
      <div
        className={`fixed h-1/2 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl top-6 -translate-y-0 md:top-1/3 left-1/2 -translate-x-1/2 md:-translate-y-1/3 bg-brand-dark ${
          modalOpen ? "cross-sell-modal-fadein" : "cross-sell-modal-fadeout"
        }`}
      >
        <div className="relative w-full h-full">
          <MdClose
            onClick={() => {
              setModalOpen(false)
              setPlayerZIndexBoost(false)
              setTimeout(() => setIsCrossSellModalOpen(false), 350)
            }}
            className="absolute text-white cursor-pointer md:text-lg lg:text-xl top-2 right-2"
          />
          <div className="flex items-center justify-center w-full h-24 crossSellBackground">
            <h2 className="max-w-[16rem] sm:max-w-sm font-bold text-center text-white md:text-2xl md:max-w-xl">
              Producers Who Bought This Item Also Bought "
              {allProducts[crossSellItemNum].title}"
            </h2>
          </div>
          {/* Product section */}
          <div className="w-full pb-6 md:pb-0 bg-brand-dark">
            <div className="flex items-center w-full h-full">
              <div className="relative w-1/2 p-2 sm:p-6 lg:p-12">
                <div className="relative">
                  <GatsbyImage
                    image={
                      imageData.allFile.edges[
                        imageData.allFile.edges.findIndex(
                          edge =>
                            edge.node.name ===
                            allProducts[crossSellItemNum].imgName
                        )
                      ]?.node.childImageSharp.gatsbyImageData
                    }
                    quality={95}
                    placeholder="blurred"
                    className={` transition ease-in-out duration-300 w-full`}
                    alt=""
                  />
                </div>
              </div>
              <div className="md:block hidden border-l border-white h-48 md:h-[18rem] lg:h-[22rem]"></div>
              <div className="relative w-1/2 p-2 sm:p-6 lg:p-12">
                <div className="flex flex-col py-6 md:py-0">
                  <p className="max-w-[10rem] sm:max-w-[10rem] md:max-w-[19rem] text-sm font-bold text-white sm:text-base md:text-lg lg:text-2xl">
                    {allProducts[crossSellItemNum].title}
                  </p>
                  <div className="flex items-center mt-2">
                    <p className="px-3 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full md:text-sm">
                      ${allProducts[crossSellItemNum].oldPrice}
                    </p>
                    <p className="ml-2 text-lg font-bold md:text-2xl text-brand-teal">
                      ${allProducts[crossSellItemNum].price}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      id="productplaybutton"
                      onClick={() => {
                        setIsPlayingModalAudio(!isPlayingModalAudio)
                        setPlayerZIndexBoost(!playerZIndexBoost)
                      }}
                      className="h-12 text-white sm:h-16 md:h-24"
                    >
                      {isPlayingModalAudio ? (
                        <MdStop
                          id="productplaybutton"
                          className="w-10 h-10 p-2 transition duration-200 ease-in-out rounded-full md:w-12 md:h-12 lg:w-14 lg:h-14 checkout-loading hover:scale-110"
                        />
                      ) : (
                        <MdPlayArrow
                          id="productplaybutton"
                          className="w-10 h-10 p-2 transition duration-200 ease-in-out rounded-full md:w-12 md:h-12 lg:w-14 lg:h-14 play-button hover:scale-110"
                        />
                      )}
                    </button>
                    <p className="ml-3 text-xs font-bold text-white md:text-base lg:text-lg">
                      Play Demo
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart()}
                    className="hidden text-xs font-bold text-white rounded-full md:py-2 lg:py-3 md:w-64 lg:w-80 md:block md:mt-0 lg:mt-3 sm:text-sm md:text-base lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300"
                  >
                    YES, ADD TO MY ORDER
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false)
                      setPlayerZIndexBoost(false)
                      setTimeout(() => setIsCrossSellModalOpen(false), 350)
                    }}
                    className="hidden text-xs font-bold text-white bg-gray-600 rounded-full md:py-2 lg:py-3 md:w-64 lg:w-80 hover:bg-gray-500 md:block md:mt-2 lg:mt-3 sm:text-sm md:text-base lg:text-xl whitespace-nowrap"
                  >
                    NO, THANKS
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => addToCart()}
              className="block w-full max-w-[18rem] sm:max-w-sm py-3 mx-auto mt-0 text-sm font-bold text-white rounded-full md:hidden lg:mt-6 sm:text-sm md:text-lg lg:text-xl whitespace-nowrap bg-brand-teal hover:bg-teal-300"
            >
              YES, ADD TO MY ORDER
            </button>
            <button
              type="button"
              onClick={() => {
                setModalOpen(false)
                setPlayerZIndexBoost(false)
                setTimeout(() => setIsCrossSellModalOpen(false), 350)
              }}
              className="block w-full max-w-[18rem] sm:max-w-sm py-3 mx-auto mt-2 text-sm font-bold text-white rounded-full md:hidden lg:mt-6 sm:text-sm md:text-lg lg:text-xl whitespace-nowrap bg-gray-600 hover:bg-gray-500"
            >
              NO, THANKS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrossSellModal
