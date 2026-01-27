import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
// import { registerOAuthRoutes } from "./oauth"; // DISABLED: OAuth removed to use custom auth only
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { generateCertificate } from "../certificate-generator";
import * as db from "../db";
import { sdk } from "./sdk";
import { setEmailConfig } from "../email";
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Initialize email configuration at startup
  if (ENV.emailUser && ENV.emailPass) {
    setEmailConfig({
      host: ENV.emailHost,
      port: ENV.emailPort,
      secure: ENV.emailSecure,
      user: ENV.emailUser,
      pass: ENV.emailPass,
    });
    console.log('[Email] Email service configured successfully');
  } else {
    console.warn('[Email] Email credentials not configured. Password reset emails will not be sent.');
    console.warn('[Email] Please set SMTP_USER and SMTP_PASS environment variables.');
  }

  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback - DISABLED
  // registerOAuthRoutes(app); // DISABLED: OAuth removed to use custom auth only
  
  // Certificate download endpoint
  app.get("/api/certificate/:certificateNumber", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const certificateNumber = req.params.certificateNumber;
      const certificate = await db.getCertificateByNumber(certificateNumber);

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      // Verify the certificate belongs to the requesting user
      if (certificate.userId !== user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      const course = await db.getCourseById(certificate.courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      await generateCertificate({
        studentName: user.name || user.email || "Student",
        courseName: course.title,
        courseCode: course.code,
        completionDate: certificate.completionDate,
        certificateNumber: certificate.certificateNumber,
        verificationToken: certificate.verificationToken,
        cpdHours: certificate.cpdHours || 0,
      }, res);
    } catch (error) {
      console.error("Certificate generation error:", error);
      res.status(500).json({ error: "Failed to generate certificate" });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Register scheduled email jobs
    import('../scheduled-emails')
      .then(({ registerScheduledEmailJobs }) => {
        registerScheduledEmailJobs();
      })
      .catch((error) => {
        console.error('[Server] Failed to register scheduled email jobs:', error);
      });
  });
}

startServer().catch(console.error);
