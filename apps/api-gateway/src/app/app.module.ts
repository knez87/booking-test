import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ClientsModule, Transport } from "@nestjs/microservices"
import { SearchController } from "./controllers/search.controller"
import { AvailabilityController } from "./controllers/availability.controller"
import { ContentController } from "./controllers/content.controller"
import { OrderController } from "./controllers/order.controller"
import { CustomerController } from "./controllers/customer.controller"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: "SEARCH_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.SEARCH_SERVICE_HOST || "localhost",
          port: Number.parseInt(process.env.SEARCH_SERVICE_PORT) || 3001,
        },
      },
      {
        name: "AVAILABILITY_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.AVAILABILITY_SERVICE_HOST || "localhost",
          port: Number.parseInt(process.env.AVAILABILITY_SERVICE_PORT) || 3002,
        },
      },
      {
        name: "CONTENT_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.CONTENT_SERVICE_HOST || "localhost",
          port: Number.parseInt(process.env.CONTENT_SERVICE_PORT) || 3003,
        },
      },
      {
        name: "ORDER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.ORDER_SERVICE_HOST || "localhost",
          port: Number.parseInt(process.env.ORDER_SERVICE_PORT) || 3004,
        },
      },
      {
        name: "CUSTOMER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.CUSTOMER_SERVICE_HOST || "localhost",
          port: Number.parseInt(process.env.CUSTOMER_SERVICE_PORT) || 3005,
        },
      },
    ]),
  ],
  controllers: [SearchController, AvailabilityController, ContentController, OrderController, CustomerController],
})
export class AppModule {}
