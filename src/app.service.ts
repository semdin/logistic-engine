import { Injectable } from '@nestjs/common';
const logisticAddon = require('bindings')('logistic_addon');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Logistic engine is online';
  }

  calculate(a: number, b: number): string {
    const result = logisticAddon.calculate(a, b);
    return "result from c++: " + result;
  }

}
