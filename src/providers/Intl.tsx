import React from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { selectLocale, selectMessages } from "../slices/language";

interface IntlProps {
  children: React.ReactNode;
}
const Intl: React.FC<IntlProps> = ({ children }: IntlProps) => {
  const locale = useSelector(selectLocale);
  const messages = useSelector(selectMessages);
  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="en">
      {children}
    </IntlProvider>
  );
};
export default Intl;
