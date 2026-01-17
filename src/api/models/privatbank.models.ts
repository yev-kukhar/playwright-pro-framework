/**
 * Моделі даних для PrivatBank API
 */

/**
 * Модель валюти (готівковий курс)
 */
export interface Currency {
  ccy: string;          // Код валюти (USD, EUR, RUR)
  base_ccy: string;     // Базова валюта (UAH)
  buy: string;          // Курс купівлі
  sale: string;         // Курс продажу
}

/**
 * Модель курсу валют на конкретну дату
 */
export interface ExchangeRate {
  baseCurrency: string;       // Базова валюта
  currency: string;           // Валюта
  saleRateNB: number;        // Курс НБУ (продаж)
  purchaseRateNB: number;    // Курс НБУ (купівля)
  saleRate: number;          // Курс банку (продаж)
  purchaseRate: number;      // Курс банку (купівля)
}

/**
 * Відповідь з історичними курсами валют
 */
export interface ExchangeRatesResponse {
  date: string;                    // Дата у форматі DD.MM.YYYY
  bank: string;                    // Назва банку (PB)
  baseCurrency: number;            // Код базової валюти
  baseCurrencyLit: string;         // Літерал базової валюти (UAH)
  exchangeRate: ExchangeRate[];    // Масив курсів валют
}

/**
 * Архівний курс валют
 */
export interface ArchiveRate {
  baseCurrency: string;
  currency: string;
  saleRateNB: number;
  purchaseRateNB: number;
  saleRate: number;
  purchaseRate: number;
}

/**
 * Enum для кодів валют
 */
export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  RUR = 'RUR',
  BTC = 'BTC',
  GBP = 'GBP',
  PLN = 'PLN',
  CHF = 'CHF',
  CZK = 'CZK',
  UAH = 'UAH'
}

/**
 * Тип курсу валют
 */
export enum CourseType {
  CASH = '5',           // Готівковий
  NON_CASH = '11'       // Безготівковий
}