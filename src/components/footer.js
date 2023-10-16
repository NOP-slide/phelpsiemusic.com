import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { AiFillYoutube, AiOutlineInstagram } from "react-icons/ai"

const Footer = ({ isPlayerOpen }) => (
  <footer>
    <div
      className={`w-full bg-brand-dark border-t border-b border-gray-600 py-10 px-0 sm:px-24 lg:px-48`}
    >
      <div className="flex flex-wrap items-center md:flex-nowrap">
        <div className="flex justify-center w-full md:justify-start md:w-1/2">
          <Link to="/">
            <StaticImage
              quality={95}
              src="../images/logo.png"
              placeholder="none"
              alt=""
              className="w-60"
            />
          </Link>
        </div>
        <div className="flex items-center justify-center w-full mt-6 md:justify-end md:w-1/2 md:mt-0">
          <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@phelpsie-kz9py" ><AiFillYoutube className="w-24 h-12 text-white" /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/phelpsie.music/" ><AiOutlineInstagram className="w-24 h-10 text-white" /></a>
        </div>
      </div>
    </div>
    <div
      className={`w-full h-16 px-0 sm:px-24 lg:px-48 bg-brand-dark flex items-center text-gray-500 justify-center space-x-6 md:space-x-12 ${
        isPlayerOpen ? "mb-48" : "mb-0"
      }`}
    >
      <p className='text-sm sm:text-base'><span className='text-xs sm:text-sm'>&copy;</span> 2023 Phelpsie Music</p>
      <Link className='text-sm sm:text-base hover:text-brand-teal' to='/privacy-policy'>Privacy Policy</Link>
      <Link className='text-sm sm:text-base hover:text-brand-teal' to='/refund-policy'>Refund Policy</Link>
    </div>
  </footer>
)

export default Footer
