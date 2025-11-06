import { HelloMessage } from '../models/hello.model';

export class HelloRepository {
  getHelloMessage(): HelloMessage {
    return { message: 'Hello, World!' };
  }
}