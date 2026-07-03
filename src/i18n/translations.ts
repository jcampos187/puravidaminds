import type { Locale, TranslationValue } from "./translations/types";
import common from "./translations/common";
import home from "./translations/home";
import products from "./translations/products";
import artisans from "./translations/artisans";
import dashboard from "./translations/dashboard";
import auth from "./translations/auth";

export type { Locale, TranslationValue };

type Translations = Record<string, Record<string, TranslationValue>>;

export const translations = {
  ...common,
  ...home,
  ...products,
  ...artisans,
  ...dashboard,
  ...auth,
} satisfies Translations;

export type TranslationKey = keyof typeof translations;
