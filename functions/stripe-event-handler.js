const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.handler = async ({ body, headers }) => {
  try {
    // check the webhook to make sure it’s valid
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    )

    // only do stuff if this is a successful Stripe Checkout purchase
    if (stripeEvent.type === "checkout.session.completed") {
      const eventObject = stripeEvent.data.object
      console.log("****EventObject******: ", eventObject)
      const items = eventObject.display_items

      // add as mailerlite subscriber
      // try {
      //   const res = await fetch(
      //     "https://connect.mailerlite.com/api/subscribers",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization:
      //           "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNTZkN2ViYmNhOTNiYTYwYWU1ZjhlY2MwZDkxN2JmYzE3MWExM2FjY2FmYTI0OGUzOTRjYTMxNzFkYzJlOGY2Mzk2ODYwNTdmY2EwODJjZjIiLCJpYXQiOjE2OTczMDI2MzEuNDQzOTksIm5iZiI6MTY5NzMwMjYzMS40NDM5OTIsImV4cCI6NDg1Mjk3NjIzMS40Mzk4NTYsInN1YiI6IjU5NTA0MCIsInNjb3BlcyI6W119.tK7vkOIUzMLX1zfxmJA6SofJfRetwAc4k6P-6qQ_hyhErCLBAZC-oq3kpyZHsgLopoqIkQSKOAJ_HsHGjgb8Ar1NQiiGcCoql3QCXAYzAJCC8qiOW-OVHf3KoS5gWbbD-R6juOvsP32Vm-PA2f54eqOrHOIRoh0bX7aO4ZSxK1bl6L07u3avVgSduyWzkgXQzMRbZ5M0a8POn5JCnvrMVrxu-w0L48hRT5daossj4HhdaUsA72VtBH_EFoPiQEDIOxdbThtqsMNLxmePsC6nz2o__41dqheKfAhbBurhUpgtovO0QQNoUCOE-PJwZLjM6KLqmNCtfRIrzEL_HwDUK8Vvnp_And8bvUvf4TBIwptXiJw-6v4cvBrkpn37Zc6s0J8wk5qqNYhgQVButjR9Wj2oDHJ1pOF9IASslsqLrowwwQjoAN4d699gGUrb9aofv1o7yKTN3S-Ed-sOMUuMM_ybWKgxzkcCPY0rcVHLTo8T52dBjHD5L4JQOdqnaD96ehNds0uK6pZ1Q0BsGYba5Ucpopd4T5_DfuAh1bmEFjmD8z-BBag382jp0_eOTkH1wsT4NstuFJzbTvI-Jn1G5FyaGkc3-0DuWuOhjnpTImjx7lHxhzmt7lausraIqO3cve3O6XhQtBNdJqOyHeVBIU29leB-whazwWOA_yfdNCs",
      //         Accept: "application/json",
      //       },
      //       body: JSON.stringify({
      //         email: "dummy@example.com",
      //         fields: {
      //           name: "Dummy",
      //           last_name: "Testerson",
      //         },
      //         groups: ["102028561285645509"],
      //       }),
      //     }
      //   )
      //   const data = await res.json()
      //   console.log("Return from mailerlite =", data)
      // } catch (error) {
      //   // eslint-disable-next-line no-console
      //   console.error(error)
      // }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`)

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    }
  }
}
