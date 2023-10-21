import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <h2 className='mx-auto my-auto text-3xl font-bold sm:text-4xl text-brand-teal'>404: Page Not Found</h2>
  </Layout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
