import { useStripe } from "@stripe/stripe-react-native";
import { isUndefined } from "lodash";
import { retrieveClientSecret } from "../services/stripeService";
import { config } from "../../config/gluestack-ui.config";

export default function useTicketing(
  eventOrganiser: string,
  ticketPrice: number
) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const buyTicket = () =>
    retrieveClientSecret(ticketPrice)
      .then((clientSecret) =>
        initPaymentSheet({
          merchantDisplayName: eventOrganiser,
          paymentIntentClientSecret: clientSecret,
          appearance: {
            colors: {
              primary: config.tokens.colors.primary500,
              background: config.tokens.colors.defaultBackgroundLight
            }
          }
        })
      )
      .then(async ({ error }) => {
        if (!isUndefined(error)) {
          throw error;
        }

        await presentPaymentSheet().then(({ error }) => {
          if (!isUndefined(error)) {
            throw error;
          }
        });
      });

  return { buyTicket };
}
