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
import Banner from "./banner"
import Cart from "./cart"
import VideoPlayer from "./VideoPlayer"
import CrossSellModal from "./CrossSellModal"
import IosChecker from "./IosChecker"
import { useSiteContext } from "../hooks/use-site-context"
import { useUserIdle } from "../hooks/use-user-idle"
import EmailCollector from "./EmailCollector"
import ExitIntentModal from "./ExitIntentModal"
import MidiCratePopup from "./MidiCratePopup"

const Layout = ({
  children,
  isPlayerOpen = false,
  hasBanner = false,
  hideCart = false,
  isMidiCrateCheckout = false,
}) => {
  const {
    isCartOpen,
    isVideoPlayerOpen,
    isCrossSellModalOpen,
    playerZIndexBoost,
    isEmailCollectorOpen,
    isMidiCratePopupOpen,
    isExitIntentModalOpen,
    setIsUserAFK,
    setIsExitIntentModalOpen,
  } = useSiteContext()

  // const onAFK = () => {
  //   if (
  //     !isPlayerOpen &&
  //     !playerZIndexBoost &&
  //     !isVideoPlayerOpen &&
  //     !isCrossSellModalOpen &&
  //     !isEmailCollectorOpen &&
  //     !isCartOpen &&
  //     !isExitIntentModalOpen &&
  //     !localStorage.getItem("phelpsieAFK")
  //   ) {
  //     setIsUserAFK(true)
  //     localStorage.setItem("phelpsieAFK", true)
  //     setIsExitIntentModalOpen(true)
  //   } else {
  //     reset()
  //   }
  // }

  // const { reset } = useUserIdle(30000, onAFK)

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
        {hasBanner && <Banner />}
        {!isMidiCrateCheckout && (
          <Header
            hideCart={hideCart}
            hasBanner={hasBanner}
            siteTitle={data.site.siteMetadata?.title || `Title`}
          />
        )}
        <main className="flex flex-col flex-1 bg-brand-dark">{children}</main>
        <IosChecker />
        {isCartOpen && <Cart />}
        {isVideoPlayerOpen && <VideoPlayer />}
        {isCrossSellModalOpen && <CrossSellModal />}
        {isEmailCollectorOpen && <EmailCollector />}
        {isMidiCratePopupOpen && <MidiCratePopup />}
        {isExitIntentModalOpen && <ExitIntentModal />}
        <Footer
          isMidiCrateCheckout={isMidiCrateCheckout}
          isPlayerOpen={isCrossSellModalOpen ? playerZIndexBoost : isPlayerOpen}
        />
      </div>
    </>
  )
}

export default Layout
