import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { region } from "../constants";
import { Stripe } from "stripe";
import {
  CreateAccLinkReq,
  CreateAccLinkRes,
  CreateAccReq,
  CreateAccRes,
  CreatePayIntentReq,
  CreatePayIntentRes
} from "../../../Shared/bodies/Stripe";

const stripe = new Stripe(
  "sk_test_51O1C0sE3ylGeoycXugwfqipnutKyJCH4M5adq4PYMNIm7uyE8M77yI8yBXZCf76TuuLzTxY6KVc005AEetEUXKyD00HZrx4IYI"
);

export const createAccount = onRequest(
  { cors: true, region: region },
  (req, res) => {
    const socName = (<CreateAccReq>JSON.parse(req.body)).name;

    stripe.accounts
      .create({
        type: "express",
        business_type: "non_profit",
        company: { name: socName }
      })
      .then((acc) => {
        const response: CreateAccRes = { stripeID: acc.id };
        res.json(response);
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(err.statusCode).json({ error: err.message });
      });
  }
);

export const createAccountLink = onRequest(
  { cors: true, region: region },
  (req, res) => {
    const stripeID = (<CreateAccLinkReq>JSON.parse(req.body)).stripeID;

    stripe.accountLinks
      .create({
        account: stripeID,
        refresh_url: "https://website.com/refresh",
        return_url: "https://website.com/return",
        type: "account_onboarding"
      })
      .then((accLink) => {
        const response: CreateAccLinkRes = { url: accLink.url };
        res.json(response);
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(err.statusCode).json({ error: err.message });
      });
  }
);

export const createPaymentIntent = onRequest(
  { cors: true, region: region },
  (req, res) => {
    const reqBody = <CreatePayIntentReq>JSON.parse(req.body);

    const params: Stripe.PaymentIntentCreateParams = {
      amount: reqBody.amount * 100,
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
      transfer_data: {
        destination: reqBody.recipientID
      }
    };

    stripe.paymentIntents
      .create(params)
      .then((intent) => {
        const response: CreatePayIntentRes = {
          clientSecret: intent.client_secret
        };
        res.json(response);
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(err.statusCode).json({ error: err.message });
      });
  }
);
