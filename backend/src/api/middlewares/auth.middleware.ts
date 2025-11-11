import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { JwtPayload } from "../../types";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string; // UUID
      };
    }
  }
}

/**
 * Middleware to extract and validate JWT token from Authorization header
 * Decodes the token and attaches user information to the request
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract Authorization header
    const authHeader = req.headers["authorization"];

    // Check if Authorization header exists
    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: {
          message: "Authorization header is required",
          code: "MISSING_TOKEN",
        },
      });
      return;
    }

    // Validate Bearer token format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      res.status(401).json({
        success: false,
        error: {
          message: "Authorization header must be in format: Bearer <token>",
          code: "INVALID_TOKEN_FORMAT",
        },
      });
      return;
    }

    const token = parts[1];

    // Verify and decode JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwt.secret as string) as any;
    } catch (error: any) {
      // In development, if verification fails, try to decode without verification
      // This allows using tokens from external auth systems
      if (config.nodeEnv === "development") {
        try {
          decoded = jwt.decode(token) as any;
          console.warn("⚠️  DEV MODE: Token signature verification skipped");

          if (!decoded) {
            res.status(401).json({
              success: false,
              error: {
                message: "Invalid token format",
                code: "INVALID_TOKEN",
              },
            });
            return;
          }

          // Check if token is expired
          if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            res.status(401).json({
              success: false,
              error: {
                message: "Token has expired",
                code: "TOKEN_EXPIRED",
              },
            });
            return;
          }
        } catch (decodeError) {
          res.status(401).json({
            success: false,
            error: {
              message: "Invalid token format",
              code: "INVALID_TOKEN",
            },
          });
          return;
        }
      } else {
        // In production, enforce strict verification
        if (error.name === "TokenExpiredError") {
          res.status(401).json({
            success: false,
            error: {
              message: "Token has expired",
              code: "TOKEN_EXPIRED",
            },
          });
          return;
        }

        if (error.name === "JsonWebTokenError") {
          res.status(401).json({
            success: false,
            error: {
              message: "Invalid token signature",
              code: "INVALID_TOKEN",
            },
          });
          return;
        }

        // Generic token validation error
        res.status(401).json({
          success: false,
          error: {
            message: "Invalid token format",
            code: "INVALID_TOKEN",
          },
        });
        return;
      }
    }

    // Extract user ID from decoded payload (support both 'userId' and 'sub' fields)
    const userId = decoded.userId || decoded.sub;

    // Validate user ID exists
    if (!userId) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Token does not contain user ID (expected userId or sub field)",
          code: "INVALID_USER_ID",
        },
      });
      return;
    }

    // Validate UUID format (8-4-4-4-12 hex characters)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      res.status(400).json({
        success: false,
        error: {
          message: "Invalid user ID format (expected UUID)",
          code: "INVALID_USER_ID",
        },
      });
      return;
    }

    // Attach user object to request
    req.user = { id: userId };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Internal server error during authentication",
        code: "AUTH_ERROR",
      },
    });
  }
};
