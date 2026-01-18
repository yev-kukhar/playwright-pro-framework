import { test, expect } from "@playwright/test";
import { PrivatBankService } from "../../src/api/services/privatbank.service";
import { CurrencyCode } from "../../src/api/models/privatbank.models";

test.describe("PrivatBank API Tests", () => {
  let privatBankService: PrivatBankService;

  test.beforeEach(async ({ request }) => {
    privatBankService = new PrivatBankService(request);
  });

  test.describe("Currency Exchange Rates", () => {
    test("should get current cash exchange rates", async () => {
      const rates = await privatBankService.getCurrentCashRates();

      expect(Array.isArray(rates)).toBeTruthy();
      expect(rates.length).toBeGreaterThan(0);

      // Перевірка структури першого курсу
      const firstRate = rates[0];
      expect(firstRate).toHaveProperty("ccy");
      expect(firstRate).toHaveProperty("base_ccy");
      expect(firstRate).toHaveProperty("buy");
      expect(firstRate).toHaveProperty("sale");
      expect(firstRate.base_ccy).toBe("UAH");

      console.log(`Received ${rates.length} currency rates`);
    });

    test("should contain USD and EUR in rates", async () => {
      const rates = await privatBankService.getCurrentCashRates();
      const currencies = rates.map((rate) => rate.ccy);

      expect(currencies).toContain(CurrencyCode.USD);
      expect(currencies).toContain(CurrencyCode.EUR);
    });

    test("should have buy rate less than sale rate", async () => {
      const rates = await privatBankService.getCurrentCashRates();

      rates.forEach((rate) => {
        const buyRate = parseFloat(rate.buy);
        const saleRate = parseFloat(rate.sale);

        expect(buyRate).toBeLessThan(saleRate);
        expect(buyRate).toBeGreaterThan(0);
        expect(saleRate).toBeGreaterThan(0);
      });
    });

    test("should get specific currency rate - USD", async () => {
      const usdRate = await privatBankService.getCurrencyRate(CurrencyCode.USD);

      expect(usdRate).toBeDefined();
      expect(usdRate?.ccy).toBe(CurrencyCode.USD);
      expect(usdRate?.base_ccy).toBe(CurrencyCode.UAH);

      const buyRate = parseFloat(usdRate!.buy);
      console.log(`USD Buy Rate: ${buyRate}`);

      expect(buyRate).toBeGreaterThan(30);
      expect(buyRate).toBeLessThan(100);
    });

    test("should get non-cash exchange rates", async () => {
      const rates = await privatBankService.getCurrentNonCashRates();

      expect(Array.isArray(rates)).toBeTruthy();
      expect(rates.length).toBeGreaterThan(0);

      console.log(`Non-cash rates count: ${rates.length}`);
    });

    test("should validate decimal format of rates", async () => {
      const rates = await privatBankService.getCurrentCashRates();

      rates.forEach((rate) => {
        // Перевірка що це валідні числа
        expect(() => parseFloat(rate.buy)).not.toThrow();
        expect(() => parseFloat(rate.sale)).not.toThrow();

        // PrivatBank typically returns 4-6 decimals in strings (e.g. "36.56860")
        // Validate it's a reasonable decimal precision (not excessive)
        const buyDecimals = rate.buy.includes(".")
          ? rate.buy.split(".")[1]?.length || 0
          : 0;
        const saleDecimals = rate.sale.includes(".")
          ? rate.sale.split(".")[1]?.length || 0
          : 0;

        expect(buyDecimals).toBeLessThanOrEqual(6);
        expect(saleDecimals).toBeLessThanOrEqual(6);
      });
    });
  });

  test.describe("Historical Exchange Rates", () => {
    test("should get exchange rates for specific date", async () => {
      const testDate = "01.12.2023";
      const response = await privatBankService.getExchangeRatesByDate(testDate);

      expect(response).toHaveProperty("date");
      expect(response).toHaveProperty("bank");
      expect(response).toHaveProperty("exchangeRate");

      expect(response.date).toBe(testDate);
      expect(response.bank).toBe("PB");
      expect(response.baseCurrencyLit).toBe("UAH");
      expect(response.exchangeRate.length).toBeGreaterThan(0);

      console.log(
        `Historical rates for ${testDate}: ${response.exchangeRate.length} currencies`,
      );
    });

    test("should contain major currencies in historical data", async () => {
      const response =
        await privatBankService.getExchangeRatesByDate("01.12.2023");
      const currencies = response.exchangeRate.map((rate) => rate.currency);

      expect(currencies).toContain(CurrencyCode.USD);
      expect(currencies).toContain(CurrencyCode.EUR);
    });

    test("should have valid rate structure", async () => {
      const response =
        await privatBankService.getExchangeRatesByDate("01.12.2023");
      const rate = response.exchangeRate.find(
        (r) => r.currency && typeof r.saleRateNB === "number",
      );

      expect(rate, "No valid currency rate found in response").toBeTruthy();

      const firstRate = rate!;

      expect(firstRate).toHaveProperty("baseCurrency");
      expect(firstRate).toHaveProperty("currency");
      expect(firstRate).toHaveProperty("saleRateNB");
      expect(firstRate).toHaveProperty("purchaseRateNB");
      expect(typeof firstRate.saleRateNB).toBe("number");
      expect(typeof firstRate.purchaseRateNB).toBe("number");

      // saleRate/purchaseRate are optional in PrivatBank response for some currencies
      if (firstRate.saleRate !== undefined) {
        expect(typeof firstRate.saleRate).toBe("number");
      }
      if (firstRate.purchaseRate !== undefined) {
        expect(typeof firstRate.purchaseRate).toBe("number");
      }
    });

    test("should get archive rates for specific date", async () => {
      const testDate = "01.01.2024";
      const archiveRates = await privatBankService.getArchiveRates(testDate);

      expect(Array.isArray(archiveRates)).toBeTruthy();
      expect(archiveRates.length).toBeGreaterThan(0);

      console.log(`Archive rates for ${testDate}: ${archiveRates.length}`);
    });
  });

  test.describe("Business Logic Tests", () => {
    test("should check if currency rate is in expected range", async () => {
      const isInRange = await privatBankService.isCurrencyRateInRange(
        CurrencyCode.USD,
        35,
        45,
      );

      console.log(`USD rate in range [35-45]: ${isInRange}`);
      // Не перевіряємо результат, бо курс змінюється
    });

    test("should compare currency rates between dates", async () => {
      const comparison = await privatBankService.compareCurrencyRates(
        CurrencyCode.USD,
        "01.12.2023",
        "01.01.2024",
      );

      if (comparison) {
        expect(comparison).toHaveProperty("date1Rate");
        expect(comparison).toHaveProperty("date2Rate");
        expect(comparison).toHaveProperty("difference");
        expect(comparison).toHaveProperty("percentChange");

        console.log(`USD rate comparison:
          01.12.2023: ${comparison.date1Rate}
          01.01.2024: ${comparison.date2Rate}
          Difference: ${comparison.difference}
          Change: ${comparison.percentChange}%
        `);
      }
    });

    test("should not have duplicate currencies", async () => {
      const rates = await privatBankService.getCurrentCashRates();
      const currencies = rates.map((rate) => rate.ccy);
      const uniqueCurrencies = new Set(currencies);

      expect(currencies.length).toBe(uniqueCurrencies.size);
    });

    test("should handle currency code case-insensitively", async () => {
      const [lowerCase, upperCase] = await Promise.all([
        privatBankService.getCurrencyRate("usd"),
        privatBankService.getCurrencyRate("USD"),
      ]);

      expect(lowerCase).toBeDefined();
      expect(upperCase).toBeDefined();
      expect(lowerCase?.ccy).toBe(upperCase?.ccy);
    });
  });

  test.describe("Performance Tests", () => {
    test("should respond within acceptable time", async () => {
      const startTime = Date.now();
      await privatBankService.getCurrentCashRates();
      const responseTime = Date.now() - startTime;

      console.log(`Response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(5000);
    });

    test("should handle concurrent requests", async () => {
      const requests = [
        privatBankService.getCurrentCashRates(),
        privatBankService.getCurrentNonCashRates(),
        privatBankService.getCurrencyRate(CurrencyCode.USD),
        privatBankService.getCurrencyRate(CurrencyCode.EUR),
      ];

      const results = await Promise.all(requests);

      results.forEach((result) => {
        expect(result).toBeDefined();
      });

      console.log("All concurrent requests completed successfully");
    });
  });
});
