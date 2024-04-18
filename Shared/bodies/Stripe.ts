export type CreateAccReq = { name: string };

export type CreateAccRes = { stripeID: string };

export type CreateAccLinkReq = { stripeID: string };

export type CreateAccLinkRes = { url: string };

export type CreatePayIntentReq = { amount: number; recipientID: string };

export type CreatePayIntentRes = { clientSecret: string | null };
