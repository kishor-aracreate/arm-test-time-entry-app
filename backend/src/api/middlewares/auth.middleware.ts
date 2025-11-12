import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";

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
 * Helper function to refresh access token using external API
 * Forwards cookies from the original request
 */
const refreshAccessToken = async (req: Request): Promise<string | null> => {
  try {
    // Forward all cookies from the original request
    const cookieHeader = req.headers.cookie || '';

    const response = await fetch(`${config.coreBackend}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader, // Forward cookies to external API
      },
    });

    const data: any = await response.json();

    if (!response.ok || !data.success || !data.data?.accessToken) {
      return null;
    }

    return data.data.accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

/**
 * Middleware to extract and validate JWT token from Authorization header
 * Decodes the token and attaches user information to the request
 * Automatically refreshes expired tokens using refresh token from cookies
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    let tokenExpired = false;
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
            tokenExpired = true;
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
          tokenExpired = true;
          decoded = jwt.decode(token) as any;
        } else if (error.name === "JsonWebTokenError") {
          res.status(401).json({
            success: false,
            error: {
              message: "Invalid token signature",
              code: "INVALID_TOKEN",
            },
          });
          return;
        } else {
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
    }

    // If token is expired, try to refresh it
    if (tokenExpired) {
      console.log('🔄 Token expired, attempting refresh...');

      // Try to refresh the access token
      const newAccessToken = await refreshAccessToken(req);

      if (!newAccessToken) {
        console.log('❌ Token refresh failed');
        res.status(401).json({
          success: false,
          error: {
            message: "Token has expired and refresh failed",
            code: "TOKEN_EXPIRED",
          },
        });
        return;
      }

      console.log('✅ Token refreshed successfully');

      // Decode the new token to get user info
      decoded = jwt.decode(newAccessToken) as any;

      if (!decoded) {
        res.status(401).json({
          success: false,
          error: {
            message: "Invalid refreshed token",
            code: "INVALID_TOKEN",
          },
        });
        return;
      }

      // Add the new token to response headers so frontend can update it
      res.setHeader('X-New-Access-Token', newAccessToken);

      // Continue processing with the refreshed token
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
