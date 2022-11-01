import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled
    // By the request handler

    // console.log("I'm running before the handler", context);

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        // console.log("I'm running before the reponse is sent out", data);
        return plainToInstance(this.dto, data, {
          // Only expose property in Dto if it decorated with @Expose()
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
