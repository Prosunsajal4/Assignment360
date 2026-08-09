import express, { Application, Request, Response } from 'express';
import path from 'path';
import { config } from './config/env';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/uploads', express.static(path.resolve(config.uploadPath)));
  }

  private configureRoutes(): void {
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  }
}
