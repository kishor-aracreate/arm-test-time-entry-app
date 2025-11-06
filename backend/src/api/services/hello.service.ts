import { HelloRepository } from '../repositories/hello.repository';
import { HelloMessage } from '../models/hello.model';

export class HelloService {
  private helloRepository: HelloRepository;

  constructor() {
    this.helloRepository = new HelloRepository();
  }

  getHelloMessage(): HelloMessage {
    return this.helloRepository.getHelloMessage();
  }
}