import {
  CreateAccLinkReq,
  CreateAccLinkRes,
  CreateAccReq,
  CreateAccRes,
  CreatePayIntentReq,
  CreatePayIntentRes
} from "../../../Shared/bodies/Stripe";

export function createAccount(name: string) {
  const requestBody: CreateAccReq = { name: name };

  return fetch("https://striperequests-createaccount-6btrxq6p7q-nw.a.run.app", {
    method: "POST",
    body: JSON.stringify(requestBody)
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw Error(res.error);
      }
      return (<CreateAccRes>res).stripeID;
    });
}

export function createAccountLink(id: string) {
  const requestBody: CreateAccLinkReq = {
    stripeID: id
  };

  return fetch(
    "https://striperequests-createaccountlink-6btrxq6p7q-nw.a.run.app",
    {
      method: "POST",
      body: JSON.stringify(requestBody)
    }
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw Error(res.error);
      }
      return (<CreateAccLinkRes>res).url;
    });
}

export function retrieveClientSecret(ticketPrice: number) {
  const requestBody: CreatePayIntentReq = {
    amount: ticketPrice
  };

  return fetch(
    "https://striperequests-createpaymentintent-6btrxq6p7q-nw.a.run.app",
    { method: "POST", body: JSON.stringify(requestBody) }
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw Error(res.error);
      }
      return (<CreatePayIntentRes>res).clientSecret;
    });
}
