import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { region } from "../constants";
import { Stripe } from "stripe";

const stripe = new Stripe(
  "sk_test_51O1C0sE3ylGeoycXugwfqipnutKyJCH4M5adq4PYMNIm7uyE8M77yI8yBXZCf76TuuLzTxY6KVc005AEetEUXKyD00HZrx4IYI"
);

export const createPaymentIntent = onRequest(
  { cors: true, region: region },
  (req, res) => {
    const ticketPriceInPounds = Number(JSON.parse(req.body).amount);

    const params: Stripe.PaymentIntentCreateParams = {
      amount: ticketPriceInPounds * 100,
      currency: "gbp",
      automatic_payment_methods: { enabled: true }
    };

    stripe.paymentIntents
      .create(params)
      .then((intent) =>
        res.json({
          clientSecret: intent.client_secret
        })
      )
      .catch((err) => {
        logger.error(err.message);
        res.status(err.statusCode).json({ error: err.message });
      });
  }
);
