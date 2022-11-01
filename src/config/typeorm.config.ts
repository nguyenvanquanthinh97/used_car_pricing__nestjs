import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const migrationsRun = process.env.NODE_ENV === 'test' ? true : false;
    const entities =
      process.env.NODE_ENV === 'test' ? ['**/*.entity.ts'] : ['**/*.entity.js'];

    return {
      type: 'sqlite',
      synchronize: false,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      entities,
      migrationsRun,
    };
  }
}
