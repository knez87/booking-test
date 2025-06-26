import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ContentController } from "./content.controller"
import { ContentService } from "./content.service"
import { VenueEntity } from "../entities/venue.entity"
import { RoomEntity } from "../entities/room.entity"
import { AddonEntity } from "../entities/addon.entity"

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
      entities: [VenueEntity, RoomEntity, AddonEntity],
      synchronize: process.env.NODE_ENV !== "production",
    }),
    TypeOrmModule.forFeature([VenueEntity, RoomEntity, AddonEntity]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class AppModule {}
