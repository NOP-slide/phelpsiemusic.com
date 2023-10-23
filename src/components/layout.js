/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Footer from "./footer"
import Cart from "./cart"
import VideoPlayer from "./VideoPlayer"
import CrossSellModal from "./CrossSellModal"
import IosChecker from "./IosChecker"
import { useSiteContext } from "../hooks/use-site-context"

const Layout = ({ children, isPlayerOpen = false }) => {
  const {
    isCartOpen,
    isVideoPlayerOpen,
    isCrossSellModalOpen,
    playerZIndexBoost,
  } = useSiteContext()

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <div className="relative flex flex-col min-h-screen antialiased bg-brand-dark fill-available">
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main className="flex flex-col flex-1 bg-brand-dark">{children}</main>
        <IosChecker />
        {isCartOpen && <Cart />}
        {isVideoPlayerOpen && <VideoPlayer />}
        {isCrossSellModalOpen && <CrossSellModal />}
        <Footer
          isPlayerOpen={isCrossSellModalOpen ? playerZIndexBoost : isPlayerOpen}
        />
      </div>
    </>
  )
}

export default Layout
