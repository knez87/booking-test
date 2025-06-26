import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CustomerController } from "./customer.controller"
import { CustomerService } from "./customer.service"
import { CustomerEntity } from "../entities/customer.entity"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "booking_journey",
      entities: [CustomerEntity],
      synchronize: process.env.NODE_ENV !== "production",
    }),
    TypeOrmModule.forFeature([CustomerEntity]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class AppModule {}
