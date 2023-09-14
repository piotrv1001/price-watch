import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.entity';
import { PriceModule } from './price/price.module';
import { Price } from './price/price.entity';
import { ExportModule } from './export/export.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { EmailConfig } from './email-config/email-config.entity';
import { EmailConfigModule } from './email-config/email-config.module';
import { Filter } from './filter/filter.entity';
import { FilterModule } from './filter/filter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Product, Price, User, EmailConfig, Filter],
        synchronize: false,
      }),
    }),
    ProductModule,
    PriceModule,
    EmailConfigModule,
    ExportModule,
    AuthModule,
    FilterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
