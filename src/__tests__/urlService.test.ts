import axios from "axios";
import { URLService } from "../services/urlService";
import { URLData } from "../types/url";
import logger from "../utils/logger";

jest.mock("axios");
jest.mock("../utils/logger");

describe("URLService", () => {
  let urlService: URLService;

  beforeEach(() => {
    urlService = new URLService();
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe("checkURLReachability", () => {
    it("should return only reachable URLs", async () => {
      const urls: URLData[] = [
        { url: "https://example.com", priority: 1 },
        { url: "https://non-existent-url.com", priority: 2 },
      ];

      (axios.get as jest.Mock).mockImplementation((url: string) => {
        if (url === "https://example.com") {
          return Promise.resolve({ status: 200 });
        }
        return Promise.reject(new Error("Network Error"));
      });

      const reachableURLs = await urlService.checkURLReachability(urls);

      expect(reachableURLs).toEqual([
        { url: "https://example.com", priority: 1 },
      ]);
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to reach URL https://non-existent-url.com: Network Error"
      );
    });

    it("should log a warning if the URL returns a non-success status code", async () => {
      const urls: URLData[] = [{ url: "https://example.com", priority: 1 }];

      (axios.get as jest.Mock).mockResolvedValue({ status: 404 }); // Not Found

      const reachableURLs = await urlService.checkURLReachability(urls);

      expect(reachableURLs).toEqual([]);
      expect(logger.warn).toHaveBeenCalledWith(
        "URL https://example.com returned non-success status code: 404"
      );
    });

    it("should handle non-Error exceptions gracefully", async () => {
      const urls: URLData[] = [{ url: "https://example.com", priority: 1 }];

      // Simulate an error that is not an instance of Error
      (axios.get as jest.Mock).mockRejectedValue("Some error string");

      const reachableURLs = await urlService.checkURLReachability(urls);

      expect(reachableURLs).toEqual([]);
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to reach URL https://example.com: Some error string"
      );
    });

    it("should timeout requests and log an error", async () => {
      jest.useFakeTimers(); // Use fake timers

      const urls: URLData[] = [{ url: "https://example.com", priority: 1 }];

      // Simulate a timeout
      (axios.get as jest.Mock).mockImplementation(() => {
        return new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 6000)
        );
      });

      const reachableURLs = urlService.checkURLReachability(urls);
      jest.runAllTimers(); // Run all timers to simulate timeout

      await expect(reachableURLs).resolves.toEqual([]);
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to reach URL https://example.com: timeout"
      );
    });
  });

  describe("sortURLsByPriority", () => {
    it("should sort URLs by priority in ascending order", () => {
      const urls: URLData[] = [
        { url: "https://example.com", priority: 3 },
        { url: "https://another-example.com", priority: 1 },
        { url: "https://yet-another-example.com", priority: 2 },
      ];

      const sortedURLs = urlService.sortURLsByPriority(urls);

      expect(sortedURLs).toEqual([
        { url: "https://another-example.com", priority: 1 },
        { url: "https://yet-another-example.com", priority: 2 },
        { url: "https://example.com", priority: 3 },
      ]);
    });
  });

  describe("filterURLsByPriority", () => {
    it("should filter URLs by the specified priority", () => {
      const urls: URLData[] = [
        { url: "https://example.com", priority: 1 },
        { url: "https://another-example.com", priority: 2 },
        { url: "https://yet-another-example.com", priority: 2 },
      ];

      const filteredURLs = urlService.filterURLsByPriority(urls, 2);

      expect(filteredURLs).toEqual([
        { url: "https://another-example.com", priority: 2 },
        { url: "https://yet-another-example.com", priority: 2 },
      ]);
    });

    it("should return an empty array if no URLs match the specified priority", () => {
      const urls: URLData[] = [
        { url: "https://example.com", priority: 1 },
        { url: "https://another-example.com", priority: 2 },
      ];

      const filteredURLs = urlService.filterURLsByPriority(urls, 3);

      expect(filteredURLs).toEqual([]);
    });
  });
});
