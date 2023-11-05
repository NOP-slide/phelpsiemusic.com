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
                "https://www.dropbox.com/scl/fi/9klvjpr9dt4c19wtha643/Imaginarium-Vol.-1-Phelpsiemusic.com.zip?rlkey=c2rmjcjrih22adn324to1x916&dl=1" +
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
          let emailHtml = `<p>Hey bro,</p><p>Thanks for checking out the loops on my website, I appreciate it. I noticed you didn't complete your purchase - no worries if you don't feel like these loops are right for your music, but if you change your mind, use this link and enter the coupon code WELCOMEBACK to receive 15% off your order.</p>`

          emailHtml +=
            `<a href="` + recoveryUrl + `">Complete your order here</a><br/>`

          emailHtml += `<br/><p>Your friend,</p><p>Phelpsie</p>`

          const sentFrom = new Sender(
            "phelpsie@phelpsiemusic.com",
            "Phelpsie Music"
          )
          const recipients = [new Recipient(email, "")]

          const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject(
              `Did you forget something? Get 15% off right now at Phelpsie Music`
            )
            .setHtml(emailHtml)
          const res = await mailerSend.email.send(emailParams)
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
