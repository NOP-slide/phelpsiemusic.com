import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { navigate } from "gatsby"

const RefundPolicyPage = () => (
  <Layout>
    <div className="max-w-xs mx-auto my-auto md:max-w-xl">
      <h1 className="text-4xl font-bold text-center text-brand-teal">
        Refund Policy
      </h1>
      <p className="mt-6 text-white">
        All purchases are final and no refunds will be issued under any
        circumstances. By purchasing, you are agreeing to these terms. The
        reason we cannot provide a refund is that once a digital good has been
        downloaded, it cannot be revoked. Thanks for your understanding.
      </p>
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

export const Head = () => <Seo title="Refund Policy" />

export default RefundPolicyPage
