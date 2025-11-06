import { Request, Response } from 'express';
import { HelloService } from '../services/hello.service';

export class HelloController {
  private helloService: HelloService;

  constructor() {
    this.helloService = new HelloService();
  }

  getHello = async (req: Request, res: Response) => {
    const message = this.helloService.getHelloMessage();
    res.status(200).json({ message });
  };
}