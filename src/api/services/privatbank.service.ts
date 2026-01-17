import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../clients/base.client';
import {
  Currency,
  ExchangeRatesResponse,
  ArchiveRate,
  CurrencyCode,
  CourseType
} from '../models/privatbank.models';

/**
 * Сервіс для роботи з PrivatBank API
 */
export class PrivatBankService extends BaseApiClient {
  
  constructor(request: APIRequestContext) {
    super(request, '/p24api');
  }

  /**
   * Отримати поточний курс валют (готівковий)
   * GET /pubinfo?exchange&coursid=5
   */
  async getCurrentCashRates(): Promise<Currency[]> {
    return this.get<Currency[]>('/pubinfo', {
      exchange: '',
      coursid: CourseType.CASH
    });
  }

  /**
   * Отримати поточний курс валют (безготівковий)
   * GET /pubinfo?exchange&coursid=11
   */
  async getCurrentNonCashRates(): Promise<Currency[]> {
    return this.get<Currency[]>('/pubinfo', {
      exchange: '',
      coursid: CourseType.NON_CASH
    });
  }

  /**
   * Отримати курс валют на конкретну дату
   * GET /exchange_rates?date=DD.MM.YYYY
   * @param date - формат DD.MM.YYYY (наприклад, 01.12.2023)
   */
  async getExchangeRatesByDate(date: string): Promise<ExchangeRatesResponse> {
    return this.get<ExchangeRatesResponse>('/exchange_rates', { date });
  }

  /**
   * Отримати архівний курс валют
   * GET /pubinfo?exchange&coursid=5&date=DD.MM.YYYY
   * @param date - формат DD.MM.YYYY
   */
  async getArchiveRates(date: string): Promise<ArchiveRate[]> {
    return this.get<ArchiveRate[]>('/pubinfo', {
      exchange: '',
      coursid: CourseType.CASH,
      date
    });
  }

  /**
   * Отримати курс конкретної валюти
   * @param currencyCode - код валюти (USD, EUR тощо)
   */
  async getCurrencyRate(currencyCode: string): Promise<Currency | undefined> {
    const rates = await this.getCurrentCashRates();
    return rates.find(
      rate => rate.ccy.toLowerCase() === currencyCode.toLowerCase()
    );
  }

  /**
   * Перевірити чи курс валюти в межах очікуваного діапазону
   * @param currencyCode - код валюти
   * @param minRate - мінімальний курс
   * @param maxRate - максимальний курс
   */
  async isCurrencyRateInRange(
    currencyCode: string,
    minRate: number,
    maxRate: number
  ): Promise<boolean> {
    const rate = await this.getCurrencyRate(currencyCode);
    
    if (!rate) {
      return false;
    }
    
    const buyRate = parseFloat(rate.buy);
    const saleRate = parseFloat(rate.sale);
    
    return buyRate >= minRate && 
           buyRate <= maxRate && 
           saleRate >= minRate && 
           saleRate <= maxRate;
  }

  /**
   * Порівняти курси валют між двома датами
   * @param currencyCode - код валюти
   * @param date1 - перша дата
   * @param date2 - друга дата
   */
  async compareCurrencyRates(
    currencyCode: string,
    date1: string,
    date2: string
  ): Promise<{
    date1Rate: number;
    date2Rate: number;
    difference: number;
    percentChange: number;
  } | null> {
    const [rates1, rates2] = await Promise.all([
      this.getExchangeRatesByDate(date1),
      this.getExchangeRatesByDate(date2)
    ]);

    const currency1 = rates1.exchangeRate.find(
      r => r.currency === currencyCode.toUpperCase()
    );
    const currency2 = rates2.exchangeRate.find(
      r => r.currency === currencyCode.toUpperCase()
    );

    if (!currency1 || !currency2) {
      return null;
    }

    const rate1 = currency1.saleRateNB;
    const rate2 = currency2.saleRateNB;
    const difference = rate2 - rate1;
    const percentChange = ((rate2 - rate1) / rate1) * 100;

    return {
      date1Rate: rate1,
      date2Rate: rate2,
      difference: parseFloat(difference.toFixed(2)),
      percentChange: parseFloat(percentChange.toFixed(2))
    };
  }
}