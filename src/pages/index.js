import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import {navigate} from 'gatsby';
import AudioPlayer from "../components/AudioPlayer"
import { MdPlayArrow, MdPause } from "react-icons/md"
import { IoStarSharp } from "react-icons/io5"
import { TfiLock } from "react-icons/tfi"
import { useSiteContext } from "../hooks/use-site-context"

import { allProducts } from "../data/all-products"

const IndexPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isHoveringProd1, setIsHoveringProd1] = React.useState(false)
  const [isHoveringProd2, setIsHoveringProd2] = React.useState(false)

  const currentSong = allProducts[currentSongIndex]

  const {
    isCrossSellModalOpen,
    crossSellItemNum,
    playerZIndexBoost,
    setVideoPlayerSrc,
    setIsVideoPlayerOpen,
  } = useSiteContext()

  return (
    <Layout isPlayerOpen={currentSongIndex !== -1}>
      {/* Hero section */}
      <div className="relative">
        <StaticImage
          quality={95}
          src="../images/northern-lights-2.jpg"
          placeholder="blurred"
          alt=""
          className="relative w-full h-80 sm:h-96"
        />
        <div className="absolute -translate-y-1/2 -translate-x-1/3 top-1/2 left-1/3">
          <h2 className="text-4xl font-bold text-white sm:text-6xl">
            Loop Kits
          </h2>
          <br />
          <p className="max-w-lg text-white text-md sm:text-xl">
            Want to make your beats sound professional? Ready to get the
            attention of major artists and move your career forward? Download
            pro-quality loops for the inspiration you need.
          </p>
        </div>
      </div>

      {/* Product card section */}
      <div className="w-full bg-brand-dark">
        <div className="flex w-full h-full max-w-[22rem] sm:gap-4 sm:max-w-xl gap-0 mx-auto mt-4 md:max-w-2xl lg:max-w-[60rem] xl:max-w-5xl md:mt-16 lg:gap-10">
          <div
            onMouseEnter={() => setIsHoveringProd1(true)}
            onMouseLeave={() => setIsHoveringProd1(false)}
            onClick={() => {
              navigate("/imaginarium-vol-1/")
            }}
            className="relative w-1/2 p-2 md:p-4 bg-brand-tealDark hover:cursor-pointer"
          >
            <div className="relative">
              <StaticImage
                quality={95}
                src="../images/products/1-imaginarium-vol-1-art.jpg"
                placeholder="blurred"
                alt=""
                className={` transition ease-in-out duration-300 w-full h-48 sm:h-64 lg:h-[28rem] ${
                  isHoveringProd1 && "brightness-75"
                }`}
              />
              <button
                type="button"
                className={`${
                  isHoveringProd1 ? "opacity-100" : "opacity-0"
                } transition ease-in-out duration-500 absolute px-4 text-sm sm:px-8 lg:px-16 py-1 md:py-3 sm:text-lg font-bold text-white -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 whitespace-nowrap bg-brand-teal`}
              >
                LEARN MORE
              </button>
              <button
                type="button"
                id="productplaybutton"
                onClick={e => {
                  if (currentSongIndex !== 0) {
                    e.stopPropagation()
                    setCurrentSongIndex(0)
                    setIsPaused(false)
                  }
                  if (currentSongIndex === 0) {
                    e.stopPropagation()
                    setIsPaused(!isPaused)
                  }
                }}
                className="h-24 text-white"
              >
                {isPaused === false && currentSongIndex === 0 ? (
                  <MdPause
                    id="productplaybutton"
                    className="absolute w-12 h-12 p-2 transition duration-200 ease-in-out rounded-full checkout-loading bottom-4 right-4 hover:scale-110"
                  />
                ) : (
                  <MdPlayArrow
                    id="productplaybutton"
                    className="absolute w-12 h-12 p-2 transition duration-200 ease-in-out rounded-full play-button bottom-4 right-4 hover:scale-110"
                  />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-6 mb-3">
              <p className="max-w-[6rem] sm:max-w-[10rem] md:max-w-[13rem] text-sm font-bold text-white hover:text-gray-300 sm:text-base">
                {allProducts[0].title}
              </p>
              <div className="flex flex-col gap-1">
                <p className="px-2 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full sm:text-sm">
                  ${allProducts[0].oldPrice}
                </p>
                <p className="px-2 text-lg font-bold sm:text-xl text-brand-teal">
                  ${allProducts[0].price}
                </p>
              </div>
            </div>
          </div>
          <div
            onMouseEnter={() => setIsHoveringProd2(true)}
            onMouseLeave={() => setIsHoveringProd2(false)}
            onClick={() => {
              navigate("/imaginarium-vol-2/")
            }}
            className="relative w-1/2 p-2 md:p-4 bg-brand-tealDark hover:cursor-pointer"
          >
            <div className="relative">
              <StaticImage
                quality={95}
                src="../images/products/2-imaginarium-vol-2-art.jpg"
                placeholder="blurred"
                alt=""
                className={` transition ease-in-out duration-300 w-full h-48 sm:h-64 lg:h-[28rem] ${
                  isHoveringProd2 && "brightness-75"
                }`}
              />
              <button
                type="button"
                className={`${
                  isHoveringProd2 ? "opacity-100" : "opacity-0"
                } transition ease-in-out duration-500 absolute px-4 text-sm sm:px-8 lg:px-16 py-1 md:py-3 sm:text-lg font-bold text-white -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 whitespace-nowrap bg-brand-teal`}
              >
                LEARN MORE
              </button>
              <button
                type="button"
                onClick={e => {
                  if (currentSongIndex !== 1) {
                    e.stopPropagation()
                    setCurrentSongIndex(1)
                    setIsPaused(false)
                  }
                  if (currentSongIndex === 1) {
                    e.stopPropagation()
                    setIsPaused(!isPaused)
                  }
                }}
                className="h-24 text-white"
              >
                {isPaused === false && currentSongIndex === 1 ? (
                  <MdPause className="absolute w-12 h-12 p-2 transition duration-200 ease-in-out rounded-full checkout-loading bottom-4 right-4 hover:scale-110" />
                ) : (
                  <MdPlayArrow className="absolute w-12 h-12 p-2 transition duration-200 ease-in-out rounded-full play-button bottom-4 right-4 hover:scale-110" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-6 mb-3">
              <p className="max-w-[6rem] sm:max-w-[10rem] md:max-w-[13rem] text-sm font-bold text-white hover:text-gray-300 sm:text-base">
                {allProducts[1].title}
              </p>
              <div className="flex flex-col gap-1">
                <p className="px-2 text-xs font-bold text-center text-white line-through bg-red-700 rounded-full sm:text-sm">
                  ${allProducts[1].oldPrice}
                </p>
                <p className="px-2 text-lg font-bold sm:text-xl text-brand-teal">
                  ${allProducts[1].price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who I've worked with section */}
      <div className="w-full pb-20 bg-brand-dark">
        <div className="flex flex-col w-full bg-brand-dark mx-auto max-w-[22rem] sm:max-w-xl md:max-w-2xl lg:max-w-[60rem] xl:max-w-5xl">
          <div className="w-full mt-4 border-t-2 border-gray-600 md:mt-12"></div>
          <h3 className="mt-12 text-2xl font-bold text-center lg:text-4xl text-brand-teal">
            WHO I'VE WORKED WITH
          </h3>
          <div className="flex mt-8 lg:mt-16">
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl italic font-bold text-gray-200 lg:text-3xl">Twysted Genius</p>
              <p className='mt-4 text-sm font-semibold text-center text-gray-200 lg:text-lg'>(Lil Baby, Future, Moneybagg Yo)</p>
            </div>
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl italic font-bold text-gray-200 lg:text-3xl">Ronny J</p>
              <p className='mt-4 text-sm font-semibold text-center text-gray-200 lg:text-lg'>(Eminem, Kanye West)</p>
            </div>
          </div>
          <div className="flex mt-8 lg:mt-16">
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl italic font-bold text-gray-200 lg:text-3xl">CuBeatz</p>
              <p className='mt-4 text-sm font-semibold text-center text-gray-200 lg:text-lg'>(Travis Scott, Drake, Nicki Minaj)</p>
            </div>
            <div className="flex flex-col items-center w-1/2">
              <p className="text-xl italic font-bold text-gray-200 lg:text-3xl">Kid Hazel</p>
              <p className='mt-4 text-sm font-semibold text-center text-gray-200 lg:text-lg'>(21 Savage, Coi Leray)</p>
            </div>
          </div>
          {/* IG screenshots section */}
          <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            WHAT THE PROS SAY
          </h3>
          <div className="flex flex-wrap gap-8 px-2 mt-8 sm:px-0 sm:mt-16 sm:gap-6 md:gap-12 sm:flex-nowrap">
            <div className="flex flex-col">
              <StaticImage
                quality={95}
                src="../images/twysted.jpg"
                placeholder="blurred"
                alt=""
                imgStyle={{ objectFit: "fill" }}
                className={`w-full sm:h-[15rem] lg:h-[23rem] `}
              />
              <div className="flex flex-col py-6 bg-teal-700/50">
                <div className="text-xl font-bold text-center text-white md:text-2xl">
                  Twysted Genius
                </div>
                <div className="text-base font-medium text-center text-white md:text-lg">
                  Multiplatinum, Grammy nominated
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <StaticImage
                quality={95}
                src="../images/kidhazel.jpg"
                placeholder="blurred"
                alt=""
                imgStyle={{ objectFit: "fill" }}
                className={`w-full sm:h-[15rem] lg:h-[23rem] `}
              />
              <div className="flex flex-col py-6 bg-teal-700/50">
                <div className="text-xl font-bold text-center text-white md:text-2xl">
                  Kid Hazel
                </div>
                <div className="text-base font-medium text-center text-white md:text-lg">
                  Multiplatinum, Grammy nominated
                </div>
              </div>
            </div>
          </div>
          <div className="relative px-2 mx-auto mt-12 sm:px-0">
            <StaticImage
              quality={95}
              src="../images/twysted-screenshot.jpg"
              placeholder="blurred"
              alt=""
              imgStyle={{ objectFit: "fill" }}
              className={`w-full sm:w-96 h-[24rem] sm:h-[30rem] mx-auto `}
            />
            <button
              className="absolute text-white duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 top-1/2 left-1/2"
              type="button"
              onClick={() => {
                setIsPaused(true)
                setVideoPlayerSrc("/twysted-ig-vertical.mp4")
                setIsVideoPlayerOpen(true)
              }}
            >
              <MdPlayArrow className="w-20 h-20 rounded-full bg-brand-teal checkout-loading" />
            </button>
          </div>
                    {/* Reviews section */}
                    <h3 className="pt-12 mt-12 text-2xl font-bold tracking-wide text-center border-t-2 border-gray-600 sm:tracking-normal lg:text-4xl text-brand-teal">
            CUSTOMER REVIEWS
          </h3>
          <div className="flex flex-wrap w-full px-2 mt-12 space-x-0 text-center text-white sm:px-0 md:flex-nowrap md:space-x-6">
            <div className="w-full md:w-1/3">
              <div className="flex justify-center mb-4">
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
              </div>
              <p>
                Every loop from my man Phelpsie is worth 100 of the ones you
                already got. Just pull the trigger fam, these joints hard
              </p>
              <br />
              <p className="font-bold">Darion Williams - Detroit, USA</p>
            </div>
            <div className="w-full mt-6 md:w-1/3 md:mt-0">
              <div className="flex justify-center mb-4">
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
              </div>
              <p>
                Thank you bro, I was able to make 5 beats with your loops so
                far. Every sound is soooo clean
              </p>
              <br />
              <p className="font-bold">Ravi Mahajan - Brampton, Canada</p>
            </div>
            <div className="w-full mt-6 md:w-1/3 md:mt-0">
              <div className="flex justify-center mb-4">
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
                <IoStarSharp className="w-6 h-6 text-yellow-500" />
              </div>
              <p>
                I compose professionally for film & TV, and I can tell you that
                this guy has it. The variety of vibes is just brilliant!
              </p>
              <br />
              <p className="font-bold">Daniel Morris - Leeds, UK</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-12">
        <TfiLock className="w-8 h-8 text-white" />
        <p className="ml-2 text-lg font-bold text-white sm:text-xl">
          Secure Payment
        </p>
      </div>
      <p className="max-w-xs mx-auto mt-6 mb-12 text-sm text-center text-white sm:text-justify sm:text-base sm:max-w-lg">
        All orders are processed through Stripe, with industry-leading 256-bit
        SSL encryption, and your information is never shared. I respect your
        privacy.
      </p>
      {/* Audio player section */}
      {isCrossSellModalOpen ? (
        <div
          className={`fixed bottom-0 py-2 flex z-50 flex-col w-full transform bg-brand-dark text-white ${
            playerZIndexBoost ? "player-shown" : "player-hidden"
          }`}
        >
          <AudioPlayer
            allProducts={allProducts}
            key={crossSellItemNum}
            isPaused={!playerZIndexBoost}
            setIsPaused={setIsPaused}
            currentSong={allProducts[crossSellItemNum]
            }
            songCount={allProducts.length}
            songIndex={crossSellItemNum
            }
            onNext={() => setCurrentSongIndex(i => i + 1)}
            onPrev={() => setCurrentSongIndex(i => i - 1)}
          />
        </div>
      ) : (
        <div
          className={`fixed bottom-0 py-2 flex z-20 flex-col w-full transform bg-brand-dark text-white ${
            currentSongIndex !== -1 ? "player-shown" : "player-hidden"
          }`}
        >
          <AudioPlayer
            allProducts={allProducts}
            key={currentSongIndex}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            currentSong={currentSong}
            songCount={allProducts.length}
            songIndex={currentSongIndex}
            onNext={() => setCurrentSongIndex(i => i + 1)}
            onPrev={() => setCurrentSongIndex(i => i - 1)}
          />
        </div>
      )}
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
