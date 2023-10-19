import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { HiOutlineShoppingCart } from "react-icons/hi"
import { useSiteContext } from "../hooks/use-site-context"

const Header = () => {
  const {setIsCartOpen} = useSiteContext();

  return (
    <header>
      <div className={`w-full bg-brand-dark py-4 px-6 lg:px-48`}>
        <div className="">
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
            <HiOutlineShoppingCart onClick={() => setIsCartOpen(true)} className="text-3xl cursor-pointer sm:text-4xl text-brand-teal" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
