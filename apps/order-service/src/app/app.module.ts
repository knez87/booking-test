import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { OrderController } from "./order.controller"
import { OrderService } from "./order.service"
import { OrderEntity } from "../entities/order.entity"
import { OrderItemEntity } from "../entities/order-item.entity"
import { OrderMessageEntity } from "../entities/order-message.entity"

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
      entities: [OrderEntity, OrderItemEntity, OrderMessageEntity],
      synchronize: process.env.NODE_ENV !== "production",
    }),
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, OrderMessageEntity]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
