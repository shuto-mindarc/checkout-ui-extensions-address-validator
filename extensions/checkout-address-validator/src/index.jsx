import React, { useEffect, useState } from "react";
import { render, Banner, BlockStack, useTranslate, useShippingAddress, useExtensionCapability, useBuyerJourneyIntercept } from "@shopify/checkout-ui-extensions-react";
import { regexValidators } from "./helpers";

render("Checkout::DeliveryAddress::RenderBefore", () => <App />);

function App() {
  // States
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    address1: false,
    address2: false,
    postCode: false,
    city: false,
  });

  // Shopify Hooks
  const translate = useTranslate();
  const canBlockProgress = useExtensionCapability("block_progress");

  // Address Form
  const address = useShippingAddress();
  const formData = {
    firstName: address?.firstName ?? "No firstname",
    lastName: address?.lastName ?? "No lastname",
    address1: address?.address1 ?? "No address1",
    address2: address?.address2 ?? "No address2",
    zip: address?.zip ?? "No postcode",
    city: address?.city ?? "No city",
  };

  const handleSetErrors = () => {
    for (const [key, value] of Object.entries(formData)) {
      const checkCharacters = regexValidators.otherCharsTest.test(value) || regexValidators.emojiTest.test(value);

      if (checkCharacters) {
        if (!errors[key]) {
          const copiedErrors = errors;
          copiedErrors[key] = true;
          setErrors(copiedErrors);
        }
      } else {
        if (errors[key]) {
          const copiedErrors = errors;
          copiedErrors[key] = false;
          setErrors(copiedErrors);
        }
      }
    }
  }

  if (canBlockProgress) {
    handleSetErrors();
  }

  const renderBanners = () => {
    let banners = [];

    for (const [key, value] of Object.entries(errors)) {
      if (value) {
        const localeKey = `fieldErrors.${key}`;
        const invalidCharsErrMsg = translate(localeKey);
        banners.push(
          <Banner key={key} status="critical">
            {invalidCharsErrMsg}
          </Banner>
        );
      }
    }
    return banners;
  };

  useBuyerJourneyIntercept(() => {
    if (Object.values(errors).some((value) => value)) {
      return {
        behavior: "block",
        reason: "No special characters in address fields",
        perform: (result) => {
          if (result.behavior === "block") {
            handleSetErrors();
          }
        },
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        handleSetErrors();
      },
    };
  });

  return (
    <BlockStack>
      {renderBanners()}
    </BlockStack>
  )
}
