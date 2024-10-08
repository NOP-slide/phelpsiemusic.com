/* eslint-disable camelcase */
const fetch = require("node-fetch")

async function conversionsAPI(
  eventName,
  source,
  ipAddress,
  userAgent,
  firstName = null,
  email = null,
  fbp,
  fbc,
  thecurrency,
  thevalue,
  eventID,
  content_name
) {
  const endpoint = `https://graph.facebook.com/v16.0/616426149897518/events?access_token=EAAEPnJFBJjUBO8PwSCBWBsQUEvRdjCdvy3URjbawYxeDvwHSYXtVsxGo1TLOHByGMQNrAvWZBtOUFIQNYGFVAxbULpXE5NlvQbrmIUAl3jATwE9OxBn7ks9SgAVbSMZB7vmP5AXLdzH8nlQsRgfLTeesl0lDcZAhElf32cDhP8iREPdVKPN8sBCywZCKzZAVESwZDZD`
  let body

  if (eventName === "MyPurchase") {
    body = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: source,
          user_data: {
            client_ip_address: ipAddress,
            client_user_agent: userAgent,
          },
          event_id: eventID,
        },
      ],
    }
  }
  if (eventName === "ViewContent") {
    body = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: source,
          user_data: {
            client_ip_address: ipAddress,
            client_user_agent: userAgent,
          },
          event_id: eventID,
          custom_data: {
            content_name: content_name,
          },
        },
      ],
    }
  }

  if (eventName === "AddToCart" || eventName === "InitiateCheckout") {
    body = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: source,
          user_data: {
            client_ip_address: ipAddress,
            client_user_agent: userAgent,
          },
          event_id: eventID,
        },
      ],
    }
  }

  if (eventName === 'Subscribe') {
    body = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: source,
          user_data: {
            client_ip_address: ipAddress,
            client_user_agent: userAgent,
            em: email,
            fn: firstName,
          },
          event_id: eventID,
          custom_data: {
            currency: thecurrency,
            value: thevalue,
          },
        },
      ],
    }
  }

  let purchaseBody

  if (eventName === "Purchase") {
    console.log("EVENT ID: ", eventID)
    purchaseBody = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: source,
          user_data: {
            client_ip_address: ipAddress,
            client_user_agent: userAgent,
            em: email,
            fn: firstName,
          },
          event_id: eventID,
          custom_data: {
            currency: thecurrency,
            value: thevalue,
          },
        },
      ],
    }
  }

  if (fbp !== "none") {
    if (eventName === "Purchase") {
      purchaseBody.data[0].user_data.fbp = fbp
    } else {
      body.data[0].user_data.fbp = fbp
    }
  }
  if (fbc !== "none") {
    if (eventName === "Purchase") {
      purchaseBody.data[0].user_data.fbc = fbc
    } else {
      body.data[0].user_data.fbc = fbc
    }
  }

  try {
    const data = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:
        eventName === "Purchase"
          ? JSON.stringify(purchaseBody)
          : JSON.stringify(body),
    }).then(res => res.json())
    console.log("DATA from function:", data)
    return []
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return []
  }
}

exports.handler = async event => {
  console.log("ASDF: ", event.body)
  const {
    eventType,
    firstName,
    email,
    fbp,
    fbc,
    currency,
    thevalue,
    sessionID,
    content_name,
  } = JSON.parse(event.body)

  console.log("sessionID 123: ", sessionID)


  const result = await conversionsAPI(
    eventType,
    event.headers.referer,
    event.headers["x-nf-client-connection-ip"],
    event.headers["user-agent"],
    firstName,
    email,
    fbp,
    fbc,
    currency,
    thevalue,
    sessionID,
    content_name
  )
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  }
}
