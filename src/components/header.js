import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { HiOutlineShoppingCart } from "react-icons/hi"
import { useSiteContext } from "../hooks/use-site-context"

const Header = ({ hasBanner, hideCart }) => {
  console.log(hasBanner)
  const { setIsCartOpen, cartItemsFromLS } = useSiteContext()

  return (
    <header className={`${hasBanner ? "mt-[32px] md:mt-[44px]" : ""}`}>
        <div className={`w-full bg-brand-dark py-4 px-6 lg:px-6`}>
          <div className="relative">
            <div className="relative flex items-center justify-between w-full">
              <Link to="/">
                <StaticImage
                  quality={95}
                  src="../images/logo.png"
                  placeholder="none"
                  alt=""
                  className="flex items-center w-48 sm:w-60"
                />
              </Link>
              <div
                onClick={() => setIsCartOpen(true)}
                className={`${hideCart ? "hidden" : "flex"} cursor-pointer`}
              >
                {cartItemsFromLS.length > 0 && (
                  <p className="absolute flex items-center px-3 font-bold text-gray-200 bg-red-600 rounded-full top-2 sm:top-1.5 sm:right-9 right-7 text-xs sm:text-base">
                    {JSON.parse(cartItemsFromLS).items.length}
                  </p>
                )}
                <HiOutlineShoppingCart className="text-3xl sm:text-4xl text-brand-teal" />
              </div>
            </div>
          </div>
        </div>
    </header>
  )
}

export default Header
