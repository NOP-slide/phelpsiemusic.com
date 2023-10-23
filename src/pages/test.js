import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { navigate } from "gatsby"
import { useSiteContext } from "../hooks/use-site-context"

const TestPage = () => {
  const {isIOS} = useSiteContext();

  return (
    <Layout>
      <div className="my-auto">
        <p className="my-4 text-3xl text-center text-white">{isIOS.toString()}</p>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="404: Not Found" />

export default TestPage
