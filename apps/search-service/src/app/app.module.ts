import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { SearchController } from "./search.controller"
import { SearchService } from "./search.service"
import { VenueEntity } from "./entities/venue.entity"

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
      entities: [VenueEntity],
      synchronize: process.env.NODE_ENV !== "production",
    }),
    TypeOrmModule.forFeature([VenueEntity]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class AppModule {}
