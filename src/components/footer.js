import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import {
  AiFillYoutube,
  AiOutlineInstagram,
} from "react-icons/ai"

const Footer = ({isPlayerOpen}) => (
  <footer>
    <div
      className={`w-full bg-gray-900 border-t border-b border-gray-600 py-10 px-0 sm:px-24 lg:px-48`}
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
          <AiFillYoutube className="w-24 h-12 text-gray-200" />
          <AiOutlineInstagram className="w-24 h-10 text-gray-200" />
        </div>
      </div>
    </div>
    <div
      className={`w-full h-16 px-48 bg-red-900 ${
        isPlayerOpen ? "mb-48" : "mb-0"
      }`}
    ></div>
  </footer>
)

export default Footer
