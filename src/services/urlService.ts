// src/services/urlService.ts
import axios from "axios";
import { URLData } from "../types/url";
import logger from "../utils/logger";

export class URLService {
  private static readonly TIMEOUT = 5000;
  private static readonly successStatusCodeMin = 200;
  private static readonly successStatusCodeMax = 299;

  async checkURLReachability(urlData: URLData[]): Promise<URLData[]> {
    const urlChecks = urlData.map(async (urlObj) => {
      try {
        const response = await axios.get(urlObj.url, {
          timeout: URLService.TIMEOUT,
        });
        if (this.isSuccessStatusCode(response.status)) {
          return urlObj;
        } else {
          logger.warn(
            `URL ${urlObj.url} returned non-success status code: ${response.status}`
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          logger.error(`Failed to reach URL ${urlObj.url}: ${error.message}`);
        } else {
          logger.error(`Failed to reach URL ${urlObj.url}: ${String(error)}`);
        }
      }
      return null;
    });

    const results = await Promise.all(urlChecks);

    return results.filter((urlObj): urlObj is URLData => urlObj !== null);
  }

  private isSuccessStatusCode(statusCode: number): boolean {
    return (
      statusCode >= URLService.successStatusCodeMin &&
      statusCode <= URLService.successStatusCodeMax
    );
  }

  sortURLsByPriority(urlData: URLData[]): URLData[] {
    return urlData.sort((a, b) => a.priority - b.priority);
  }

  filterURLsByPriority(urlData: URLData[], priority: number): URLData[] {
    return urlData.filter((url) => url.priority === priority);
  }
}
