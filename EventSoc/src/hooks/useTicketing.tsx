import { useStripe } from "@stripe/stripe-react-native";
import { isNull, isUndefined } from "lodash";
import { retrieveClientSecret } from "../services/stripeService";
import { config } from "../config/gluestack-ui.config";
import { SocietyOverview } from "../../../Shared/models/Society";

export default function useTicketing(
  eventOrganiser: SocietyOverview,
  ticketPrice: number
) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const buyTicket = () =>
    retrieveClientSecret(ticketPrice, eventOrganiser.stripeID)
      .then((clientSecret) =>
        initPaymentSheet({
          merchantDisplayName: eventOrganiser.name,
          paymentIntentClientSecret: clientSecret || "",
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
