import { NestFactory } from "@nestjs/core"
import { Transport, type MicroserviceOptions } from "@nestjs/microservices"
import { AppModule } from "./app/app.module"

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: Number.parseInt(process.env.PORT) || 3004,
    },
  })

  await app.listen()
  console.log("📋 Order Service is listening on port", process.env.PORT || 3004)
}

bootstrap()
