import { Request, Response, NextFunction } from "express";
import { URLData } from "../types/url";
import { validateURLs } from "../middlewares/validateUrls";

describe("validateURLs Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it("should call next() if no urls are provided in the body", () => {
    req.body = {}; // No urls field

    validateURLs(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 400 if urls is not an array", () => {
    req.body = {
      urls: "this is not an array",
    };

    validateURLs(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid input: Expected an array of URLs",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if any url object does not have a string url or number priority", () => {
    req.body = {
      urls: [
        { url: "https://example.com", priority: 1 },
        { url: 12345, priority: 2 }, // Invalid URL
        { url: "https://another.com", priority: "not a number" }, // Invalid priority
      ],
    };

    validateURLs(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid input: URL must be a string and priority a number",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() if urls is an array of valid URLData objects", () => {
    const validURLs: URLData[] = [
      { url: "https://example.com", priority: 1 },
      { url: "https://another.com", priority: 2 },
    ];

    req.body = {
      urls: validURLs,
    };

    validateURLs(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
