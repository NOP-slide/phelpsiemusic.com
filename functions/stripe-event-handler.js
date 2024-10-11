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

    console.log("******Stripe Event********: ", stripeEvent)

    // Fulfill purchase or subscription
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

      if (eventObject.mode !== "subscription") {
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
      } else if (eventObject.mode === "subscription") {
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
                  name: fullName ? fullName : "Unknown Name",
                  last_name: "",
                },
                groups: ["106012119667836703"],
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

    // Handle card authorization success
    if (stripeEvent.type === "payment_intent.amount_capturable_updated") {
      const eventObject = stripeEvent.data.object
      // Cancel the authorization charge
      const cancelRes = await stripe.paymentIntents.cancel(eventObject.id)
    }

    // Handle subscription success
    if (stripeEvent.type === "customer.subscription.updated") {
      const eventObject = stripeEvent.data.object
      console.log("****EventObject******: ", eventObject)
      if (
        eventObject.status === "trialing" &&
        eventObject.metadata.authenticated === "true"
      ) {
        const customer = await stripe.customers.retrieve(eventObject.customer)
        console.log("***********Customer:*********** ", customer)
        const email = customer.email
        const firstName = customer.name

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
                  name: firstName,
                  last_name: "",
                },
                groups: ["106012119667836703"],
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

    // Handle subscription cancellation
    if (
      stripeEvent.type === "customer.subscription.deleted" &&
      stripeEvent.data.object.cancellation_details.comment !== "card_failed"
    ) {
      const eventObject = stripeEvent.data.object
      console.log("****EventObject******: ", eventObject)
      const customer = await stripe.customers.retrieve(eventObject.customer)
      console.log("Customer: ", customer)
      let customerData
      // Get subscriber ID from Mailerlite
      try {
        const res = await fetch(
          `https://connect.mailerlite.com/api/subscribers/${customer.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNTZkN2ViYmNhOTNiYTYwYWU1ZjhlY2MwZDkxN2JmYzE3MWExM2FjY2FmYTI0OGUzOTRjYTMxNzFkYzJlOGY2Mzk2ODYwNTdmY2EwODJjZjIiLCJpYXQiOjE2OTczMDI2MzEuNDQzOTksIm5iZiI6MTY5NzMwMjYzMS40NDM5OTIsImV4cCI6NDg1Mjk3NjIzMS40Mzk4NTYsInN1YiI6IjU5NTA0MCIsInNjb3BlcyI6W119.tK7vkOIUzMLX1zfxmJA6SofJfRetwAc4k6P-6qQ_hyhErCLBAZC-oq3kpyZHsgLopoqIkQSKOAJ_HsHGjgb8Ar1NQiiGcCoql3QCXAYzAJCC8qiOW-OVHf3KoS5gWbbD-R6juOvsP32Vm-PA2f54eqOrHOIRoh0bX7aO4ZSxK1bl6L07u3avVgSduyWzkgXQzMRbZ5M0a8POn5JCnvrMVrxu-w0L48hRT5daossj4HhdaUsA72VtBH_EFoPiQEDIOxdbThtqsMNLxmePsC6nz2o__41dqheKfAhbBurhUpgtovO0QQNoUCOE-PJwZLjM6KLqmNCtfRIrzEL_HwDUK8Vvnp_And8bvUvf4TBIwptXiJw-6v4cvBrkpn37Zc6s0J8wk5qqNYhgQVButjR9Wj2oDHJ1pOF9IASslsqLrowwwQjoAN4d699gGUrb9aofv1o7yKTN3S-Ed-sOMUuMM_ybWKgxzkcCPY0rcVHLTo8T52dBjHD5L4JQOdqnaD96ehNds0uK6pZ1Q0BsGYba5Ucpopd4T5_DfuAh1bmEFjmD8z-BBag382jp0_eOTkH1wsT4NstuFJzbTvI-Jn1G5FyaGkc3-0DuWuOhjnpTImjx7lHxhzmt7lausraIqO3cve3O6XhQtBNdJqOyHeVBIU29leB-whazwWOA_yfdNCs",
              Accept: "application/json",
            },
          }
        )
        customerData = await res.json()
        console.log("Return from mailerlite =", customerData)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
      // Remove customer from MIDI Crate subscription group
      try {
        const res = await fetch(
          `https://connect.mailerlite.com/api/subscribers/${customerData.data.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNTZkN2ViYmNhOTNiYTYwYWU1ZjhlY2MwZDkxN2JmYzE3MWExM2FjY2FmYTI0OGUzOTRjYTMxNzFkYzJlOGY2Mzk2ODYwNTdmY2EwODJjZjIiLCJpYXQiOjE2OTczMDI2MzEuNDQzOTksIm5iZiI6MTY5NzMwMjYzMS40NDM5OTIsImV4cCI6NDg1Mjk3NjIzMS40Mzk4NTYsInN1YiI6IjU5NTA0MCIsInNjb3BlcyI6W119.tK7vkOIUzMLX1zfxmJA6SofJfRetwAc4k6P-6qQ_hyhErCLBAZC-oq3kpyZHsgLopoqIkQSKOAJ_HsHGjgb8Ar1NQiiGcCoql3QCXAYzAJCC8qiOW-OVHf3KoS5gWbbD-R6juOvsP32Vm-PA2f54eqOrHOIRoh0bX7aO4ZSxK1bl6L07u3avVgSduyWzkgXQzMRbZ5M0a8POn5JCnvrMVrxu-w0L48hRT5daossj4HhdaUsA72VtBH_EFoPiQEDIOxdbThtqsMNLxmePsC6nz2o__41dqheKfAhbBurhUpgtovO0QQNoUCOE-PJwZLjM6KLqmNCtfRIrzEL_HwDUK8Vvnp_And8bvUvf4TBIwptXiJw-6v4cvBrkpn37Zc6s0J8wk5qqNYhgQVButjR9Wj2oDHJ1pOF9IASslsqLrowwwQjoAN4d699gGUrb9aofv1o7yKTN3S-Ed-sOMUuMM_ybWKgxzkcCPY0rcVHLTo8T52dBjHD5L4JQOdqnaD96ehNds0uK6pZ1Q0BsGYba5Ucpopd4T5_DfuAh1bmEFjmD8z-BBag382jp0_eOTkH1wsT4NstuFJzbTvI-Jn1G5FyaGkc3-0DuWuOhjnpTImjx7lHxhzmt7lausraIqO3cve3O6XhQtBNdJqOyHeVBIU29leB-whazwWOA_yfdNCs",
              Accept: "application/json",
            },
            body: JSON.stringify({
              groups: ["106015795520210579"],
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

    // Handle subscription payments
    if (stripeEvent.type === "invoice.paid") {
      console.log("Invoice paid: ", stripeEvent.data.object)

      if (stripeEvent.data.object.amount_paid > 0) {
        let customerEmail = stripeEvent.data.object.customer_email

        let customerData
        // Get subscriber ID from Mailerlite
        try {
          const res = await fetch(
            `https://connect.mailerlite.com/api/subscribers/${customerEmail}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNTZkN2ViYmNhOTNiYTYwYWU1ZjhlY2MwZDkxN2JmYzE3MWExM2FjY2FmYTI0OGUzOTRjYTMxNzFkYzJlOGY2Mzk2ODYwNTdmY2EwODJjZjIiLCJpYXQiOjE2OTczMDI2MzEuNDQzOTksIm5iZiI6MTY5NzMwMjYzMS40NDM5OTIsImV4cCI6NDg1Mjk3NjIzMS40Mzk4NTYsInN1YiI6IjU5NTA0MCIsInNjb3BlcyI6W119.tK7vkOIUzMLX1zfxmJA6SofJfRetwAc4k6P-6qQ_hyhErCLBAZC-oq3kpyZHsgLopoqIkQSKOAJ_HsHGjgb8Ar1NQiiGcCoql3QCXAYzAJCC8qiOW-OVHf3KoS5gWbbD-R6juOvsP32Vm-PA2f54eqOrHOIRoh0bX7aO4ZSxK1bl6L07u3avVgSduyWzkgXQzMRbZ5M0a8POn5JCnvrMVrxu-w0L48hRT5daossj4HhdaUsA72VtBH_EFoPiQEDIOxdbThtqsMNLxmePsC6nz2o__41dqheKfAhbBurhUpgtovO0QQNoUCOE-PJwZLjM6KLqmNCtfRIrzEL_HwDUK8Vvnp_And8bvUvf4TBIwptXiJw-6v4cvBrkpn37Zc6s0J8wk5qqNYhgQVButjR9Wj2oDHJ1pOF9IASslsqLrowwwQjoAN4d699gGUrb9aofv1o7yKTN3S-Ed-sOMUuMM_ybWKgxzkcCPY0rcVHLTo8T52dBjHD5L4JQOdqnaD96ehNds0uK6pZ1Q0BsGYba5Ucpopd4T5_DfuAh1bmEFjmD8z-BBag382jp0_eOTkH1wsT4NstuFJzbTvI-Jn1G5FyaGkc3-0DuWuOhjnpTImjx7lHxhzmt7lausraIqO3cve3O6XhQtBNdJqOyHeVBIU29leB-whazwWOA_yfdNCs",
                Accept: "application/json",
              },
            }
          )
          customerData = await res.json()
          console.log("Return from mailerlite =", customerData)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        }

        // Add to month x of MIDI Crate
        let month = '2';
        let group = ["114573246580393257"];

        if (customerData.data.fields.midi_crate_month === '2') {
          month = '3';
          group = ["118132620505646144"];
        }
        if (customerData.data.fields.midi_crate_month === '3') {
          month = '4';
          group = ["120808100158506484"];
        }
        if (customerData.data.fields.midi_crate_month === '4') {
          month = '5';
          group = ["123631577366267411"];
        }
        if (customerData.data.fields.midi_crate_month === '5') {
          month = '6';
          group = ["126507348219921795"];
        }
        if (customerData.data.fields.midi_crate_month === '6') {
          month = '7';
          group = ["129301189210670882"];
        }
        if (customerData.data.fields.midi_crate_month === '7') {
          month = '8';
          group = ["132023475689751938"];
        }
        if (customerData.data.fields.midi_crate_month === '8') {
          month = '9';
          group = ["134930782118479326"];
        }
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
                email: customerEmail,
                fields: {
                  midi_crate_month: month,
                },
                groups: group,
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

    // Handle abandoned carts
    if (stripeEvent.type === "checkout.session.expired") {
      const session = stripeEvent.data.object
      console.log("Expired session: ", session)

      const email = session.customer_details?.email
      const recoveryUrl = session.after_expiration?.recovery?.url

      if (email && recoveryUrl && session.mode !== "subscription") {
        try {
          let emailHtml = `<p>Hey producer!</p><p>Thanks for checking out my website, I appreciate it. I noticed you didn't complete your purchase - no worries at all, but if you change your mind, use this link and enter the coupon code WELCOMEBACK to receive 15% off.</p>`

          emailHtml +=
            `<a href="` + recoveryUrl + `">Complete your purchase</a><br/>`

          emailHtml += `<br/><p>Warm regards,</p><p>Phelpsie</p>`

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

      // ********************************
      // MIDI Crate Abandoned Cart
      // ********************************
      if (email && recoveryUrl && session.mode === "subscription") {
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
                  recovery_url: recoveryUrl,
                },
                groups: ["112583430793856778"],
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
