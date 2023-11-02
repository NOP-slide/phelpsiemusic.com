const stripe = require("stripe")(process.env.STRIPE_SECRET)
const Recipient = require("mailersend").Recipient
const EmailParams = require("mailersend").EmailParams
const Sender = require("mailersend").Sender
const MailerSend = require("mailersend").MailerSend

exports.handler = async ({ body }) => {
  const email = JSON.parse(body).email

  try {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    })

    // Send free loop email
    try {
      let emailHtml = `<p>Hey there,</p><p>Thanks for visiting Phelpsie Music!</p><p>As a token of my appreciation, the link to your free loop is below:</p>`
      emailHtml +=
        `<a href="` +
        "https://www.dropbox.com/scl/fi/xviccd5bochwwr2wes7s6/Stardust-Symphony-143bpm-F-minor-prod.-phelpsie.mp3?rlkey=rzjc39qkuvv5bo8bft1tjhyro&dl=1" +
        `">` +
        "Stardust Symphony - 143bpm - F minor [prod. phelpsie].mp3" +
        `</a><br/>`
      emailHtml += `<br/><p>If you create a beat with this loop, feel free to send it to me - I'd love to hear it.</p>`
      emailHtml += `<p>With that, I wish you continued inspiration, and hope to see you again soon. Keep making music!</p><br/><p>Your friend,</p><p>Phelpsie</p>`

      const sentFrom = new Sender(
        "phelpsie@phelpsiemusic.com",
        "Phelpsie Music"
      )
      const recipients = [new Recipient(email, "")]

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(`Your Free Loop`)
        .setHtml(emailHtml)
      const res = await mailerSend.email.send(emailParams)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    }
  } catch (err) {
    console.log(`Webhook failed with ${err}`)

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    }
  }
}
