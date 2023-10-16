/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

// You can delete this file if you're not using it
import PropTypes from "prop-types"
import * as React from "react"
import { SiteProvider } from "./src/context"
import "./src/styles/global.css"

export const wrapRootElement = ({ element }) => (
  <SiteProvider>{element}</SiteProvider>
)

wrapRootElement.propTypes = {
  element: PropTypes.node.isRequired,
}
