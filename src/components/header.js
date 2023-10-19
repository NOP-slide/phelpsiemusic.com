import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { HiOutlineShoppingCart } from "react-icons/hi"
import { useSiteContext } from "../hooks/use-site-context"

const Header = () => {
  const { setIsCartOpen } = useSiteContext()

  return (
    <header>
      <div className={`w-full bg-brand-dark py-4 px-6 lg:px-6`}>
        <div className="relative">
          <div className="flex items-center justify-between w-full">
            <Link to="/">
              <StaticImage
                quality={95}
                src="../images/logo.png"
                placeholder="none"
                alt=""
                className="w-52 sm:w-60"
              />
            </Link>
            <HiOutlineShoppingCart
              onClick={() => setIsCartOpen(true)}
              className="text-3xl cursor-pointer sm:text-4xl text-brand-teal"
            />
          </div>
          {/* <div className="absolute hidden italic font-semibold tracking-wider text-gray-300 -translate-y-1/2 whitespace-nowrap sm:text-sm sm:pl-10 md:pl-0 sm:-translate-x-1/4 lg:-translate-x-1/3 md:text-lg lg:text-xl sm:block top-1/2 left-1/2">
            Premium Tools for the Discerning Producer
          </div>
          <div className="block mt-6 text-sm italic font-semibold tracking-wider text-center text-gray-300 whitespace-nowrap sm:hidden">
            Premium Tools for the Discerning Producer
          </div> */}
        </div>
      </div>
    </header>
  )
}

export default Header
