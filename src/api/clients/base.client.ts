import { APIRequestContext, APIResponse, expect } from "@playwright/test";

/**
 * BaseApiClient
 *
 * Base class for all API clients.
 *
 * Design principles:
 * 1) Does NOT read environment variables directly.
 *    (baseURL is provided by Playwright project configuration)
 * 2) Works ONLY with relative paths.
 * 3) Encapsulates URL building and common HTTP operations.
 *
 * Benefits:
 * - No baseURL conflicts between UI and API.
 * - Clear separation of responsibilities.
 * - Easy scalability for multiple APIs / environments.
 */
export abstract class BaseApiClient {
  constructor(
    protected readonly request: APIRequestContext,

    /**
     * basePath — API base path (e.g. '/p24api')
     * Used to group endpoints of a specific service.
     */
    private readonly basePath: string = "",
  ) {}

  /**
   * Builds a relative URL using basePath + path + query parameters.
   *
   * Example:
   * basePath = '/p24api'
   * path     = '/exchange_rates'
   * query    = { json: true, date: '01.12.2023' }
   *
   * Result:
   * /p24api/exchange_rates?json=true&date=01.12.2023
   */
  protected buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): string {
    const normalizedBase =
      this.basePath && !this.basePath.startsWith("/")
        ? `/${this.basePath}`
        : this.basePath;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    const urlPath = `${normalizedBase}${normalizedPath}`.replace(
      /\/{2,}/g,
      "/",
    );

    if (!query) return urlPath;

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      params.set(key, String(value));
    }

    const qs = params.toString();
    return qs ? `${urlPath}?${qs}` : urlPath;
  }

  /**
   * HTTP GET
   * Used for read-only requests.
   */
  protected async get<T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    const url = this.buildUrl(path, query);
    const response = await this.request.get(url);
    return this.expectOkJson<T>(response);
  }

  /**
   * HTTP POST
   * Content-Type is handled by Playwright automatically,
   * or can be overridden per-request if needed.
   */
  protected async post(
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
  ): Promise<APIResponse> {
    const url = this.buildUrl(path, query);
    return this.request.post(url, { data: body });
  }

  /**
   * Escape hatch: raw response (status, headers, non-JSON assertions)
   */
  protected async getResponse(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): Promise<APIResponse> {
    const url = this.buildUrl(path, query);
    return this.request.get(url);
  }

  /**
   * Common assertion for successful JSON response.
   * Provides a consistent validation style across API tests.
   */
  protected async expectOkJson<T>(response: APIResponse): Promise<T> {
    expect(
      response.ok(),
      `Expected 2xx response, but received ${response.status()}`,
    ).toBeTruthy();

    return (await response.json()) as T;
  }
}
