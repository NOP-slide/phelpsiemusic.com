const stripe = require("stripe")(process.env.STRIPE_SECRET)
const Recipient = require("mailersend").Recipient
const EmailParams = require("mailersend").EmailParams
const Sender = require("mailersend").Sender
const MailerSend = require("mailersend").MailerSend

exports.handler = async ({ body, headers }) => {
  try {
    // Check the webhook to make sure it’s valid
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    )

    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    })

    // Fulfill order if this is a successful Stripe Checkout purchase
    if (stripeEvent.type === "checkout.session.completed") {
      const eventObject = stripeEvent.data.object
      console.log("****EventObject******: ", eventObject)
      const email = eventObject.customer_details.email
      const fullName = eventObject.customer_details.name

      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        stripeEvent.data.object.id,
        {
          expand: ["line_items"],
        }
      )
      const lineItems = sessionWithLineItems.line_items
      console.log("LINE ITEMS: ", lineItems)

      try {
        let emailHtml = `<p>Hey,</p><p>Thank you so much for purchasing from me at Phelpsie Music. I appreciate you!</p><p>Please find your downloads below:</p>`
        lineItems.data.map(item => {
          switch (item.description) {
            case "Imaginarium Vol. 1 - Trap & Drill Loop Kit":
              emailHtml +=
                `<a href="` +
                "https://www.dropbox.com/scl/fi/8c2h0rl2x3cma7q8t3k1u/Imaginarium-Vol.-1-Phelpsiemusic.com.zip?rlkey=ln57hz2nt773b6en9od83uy7m&dl=1" +
                `">` +
                item.description +
                `</a><br/>`
              break
            case "Imaginarium Vol. 2 - Trap & Drill Loop Kit":
              emailHtml +=
                `<a href="` +
                "https://www.dropbox.com/scl/fi/lxd66aib5r1xi6gkr2xh8/Imaginarium-Vol.-2-Phelpsiemusic.com.zip?rlkey=osaypki1dn9d99xgqce7epu39&dl=1" +
                `">` +
                item.description +
                `</a><br/>`
              break
          }
        })

        emailHtml += `<br/><p>I wish you continued inspiration, and hope to see you again soon. Keep making music!</p><br/><p>Your friend,</p><p>Phelpsie</p>`

        const sentFrom = new Sender(
          "phelpsie@phelpsiemusic.com",
          "Phelpsie Music"
        )
        const recipients = [new Recipient(email, fullName)]

        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setReplyTo(sentFrom)
          .setSubject(`Thank you ${fullName}! Your download links are inside`)
          .setHtml(emailHtml)
        const res = await mailerSend.email.send(emailParams)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }

    // Handle abandoned carts
    if (stripeEvent.type === "checkout.session.expired") {
      const session = stripeEvent.data.object
      console.log("Expired session: ", session)

      const email = session.customer_details?.email
      const recoveryUrl = session.after_expiration?.recovery?.url

      if (email && recoveryUrl) {
        try {
          const res = await fetch(
            "https://connect.mailerlite.com/api/subscribers",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNTZkN2ViYmNhOTNiYTYwYWU1ZjhlY2MwZDkxN2JmYzE3MWExM2FjY2FmYTI0OGUzOTRjYTMxNzFkYzJlOGY2Mzk2ODYwNTdmY2EwODJjZjIiLCJpYXQiOjE2OTczMDI2MzEuNDQzOTksIm5iZiI6MTY5NzMwMjYzMS40NDM5OTIsImV4cCI6NDg1Mjk3NjIzMS40Mzk4NTYsInN1YiI6IjU5NTA0MCIsInNjb3BlcyI6W119.tK7vkOIUzMLX1zfxmJA6SofJfRetwAc4k6P-6qQ_hyhErCLBAZC-oq3kpyZHsgLopoqIkQSKOAJ_HsHGjgb8Ar1NQiiGcCoql3QCXAYzAJCC8qiOW-OVHf3KoS5gWbbD-R6juOvsP32Vm-PA2f54eqOrHOIRoh0bX7aO4ZSxK1bl6L07u3avVgSduyWzkgXQzMRbZ5M0a8POn5JCnvrMVrxu-w0L48hRT5daossj4HhdaUsA72VtBH_EFoPiQEDIOxdbThtqsMNLxmePsC6nz2o__41dqheKfAhbBurhUpgtovO0QQNoUCOE-PJwZLjM6KLqmNCtfRIrzEL_HwDUK8Vvnp_And8bvUvf4TBIwptXiJw-6v4cvBrkpn37Zc6s0J8wk5qqNYhgQVButjR9Wj2oDHJ1pOF9IASslsqLrowwwQjoAN4d699gGUrb9aofv1o7yKTN3S-Ed-sOMUuMM_ybWKgxzkcCPY0rcVHLTo8T52dBjHD5L4JQOdqnaD96ehNds0uK6pZ1Q0BsGYba5Ucpopd4T5_DfuAh1bmEFjmD8z-BBag382jp0_eOTkH1wsT4NstuFJzbTvI-Jn1G5FyaGkc3-0DuWuOhjnpTImjx7lHxhzmt7lausraIqO3cve3O6XhQtBNdJqOyHeVBIU29leB-whazwWOA_yfdNCs",
                Accept: "application/json",
              },
              body: JSON.stringify({
                email: email,
                fields: {
                  name: session.customer_details.name
                    ? session.customer_details.name
                    : "Unknown Name",
                  last_name: "",
                  recovery_url: recoveryUrl,
                },
                groups: ["102709796762813970"],
              }),
            }
          )
          const data = await res.json()
          console.log("Return from mailerlite =", data)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      }
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
