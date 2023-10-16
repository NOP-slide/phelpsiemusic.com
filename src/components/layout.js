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
import { useSiteContext } from "../hooks/use-site-context";

const Layout = ({ children, isPlayerOpen = false }) => {
  const {isCartOpen} = useSiteContext();

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
      <div className="relative flex flex-col min-h-screen antialiased bg-gray-200 fill-available">
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main className="flex flex-col flex-1">{children}</main>
        {isCartOpen && <Cart />}
        <Footer isPlayerOpen={isPlayerOpen} />
      </div>
    </>
  )
}

export default Layout
