import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { navigate } from "gatsby"

const NotFoundPage = () => (
  <Layout>
    <div className="my-auto">
      <h2 className="mx-auto text-3xl font-bold text-center sm:text-4xl text-brand-teal">
        404: Page Not Found
      </h2>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex items-center justify-center px-4 py-1 mx-auto mt-6 text-xl font-bold text-white rounded-full bg-brand-teal"
      >
        Back To Shop
      </button>
    </div>
  </Layout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
