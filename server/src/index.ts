import cors from "cors";
import express, { Application, Request, Response } from "express";
import { openAIController } from "./controllers/openAI.controller";

class Server {
  private PORT: number;
  private app: Application;
  private aiController: openAIController;

  constructor() {
    this.PORT = 8000;
    this.app = express();
    this.aiController = new openAIController();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware() {
    this.app.use(cors()); // Enable CORS for all routes
  }

  private configureRoutes() {
    this.app.get("/", (_: Request, res: Response) => {
      res.status(200).send("App is Live...");
    });

    this.app.post("/stream-data", (_: Request, res: Response) => {
      this.aiController.generateChat(res);
      // res.status(200).send("Data fetched");
    });
  }

  public start() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on PORT ${this.PORT}`);
    });
  }
}

const server = new Server();
server.start();
