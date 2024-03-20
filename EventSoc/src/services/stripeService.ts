export function retrieveClientSecret(ticketPrice: number) {
  const requestBody = JSON.stringify({
    amount: ticketPrice
  });

  return fetch(
    "https://striperequests-createpaymentintent-6btrxq6p7q-nw.a.run.app",
    { method: "POST", body: requestBody }
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw Error(res.error);
      }
      return res.clientSecret;
    });
}
