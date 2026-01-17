import { APIRequestContext, APIResponse } from '@playwright/test';
import 'dotenv/config';

/**
 * Базовий API клієнт для всіх HTTP запитів
 */
export class BaseApiClient {
  protected baseUrl: string;

  constructor(
    protected request: APIRequestContext,
    basePath: string = ''
  ) {
    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL is not defined in environment variables');
    }
    this.baseUrl = `${apiBaseUrl}${basePath}`;
  }

  /**
   * GET запит
   * @param path - шлях до ресурсу
   * @param params - query параметри
   */
  protected async get<T>(
    path: string,
    params?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await this.request.get(url);
    await this.validateResponse(response);
    return response.json() as T;
  }

  /**
   * POST запит
   * @param path - шлях до ресурсу
   * @param data - тіло запиту
   * @param params - query параметри
   */
  protected async post<T>(
    path: string,
    data: any,
    params?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await this.request.post(url, { data });
    await this.validateResponse(response);
    return response.json() as T;
  }

  /**
   * PUT запит
   * @param path - шлях до ресурсу
   * @param data - тіло запиту
   * @param params - query параметри
   */
  protected async put<T>(
    path: string,
    data: any,
    params?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await this.request.put(url, { data });
    await this.validateResponse(response);
    return response.json() as T;
  }

  /**
   * DELETE запит
   * @param path - шлях до ресурсу
   * @param params - query параметри
   */
  protected async delete<T>(
    path: string,
    params?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await this.request.delete(url);
    await this.validateResponse(response);
    return response.json() as T;
  }

  /**
   * PATCH запит
   * @param path - шлях до ресурсу
   * @param data - тіло запиту
   * @param params - query параметри
   */
  protected async patch<T>(
    path: string,
    data: any,
    params?: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await this.request.patch(url, { data });
    await this.validateResponse(response);
    return response.json() as T;
  }

  /**
   * Отримати raw response для кастомної обробки
   */
  protected async getRawResponse(
    path: string,
    params?: Record<string, string>
  ): Promise<APIResponse> {
    const url = this.buildUrl(path, params);
    return this.request.get(url);
  }

  /**
   * Побудова URL з query параметрами
   */
  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = `${this.baseUrl}${path}`;
    
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryParams = new URLSearchParams(params);
    return `${url}?${queryParams.toString()}`;
  }

  /**
   * Валідація HTTP відповіді
   */
  private async validateResponse(response: APIResponse): Promise<void> {
    if (!response.ok()) {
      const body = await response.text().catch(() => 'Unable to read response body');
      const errorMessage = `API request failed: ${response.status()} ${response.statusText()}\nURL: ${response.url()}\nResponse: ${body}`;
      throw new Error(errorMessage);
    }
  }
}