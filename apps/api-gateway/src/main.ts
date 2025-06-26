import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app/app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
  })

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Booking Journey API")
    .setDescription("API Gateway for the Booking Journey application")
    .setVersion("1.0")
    .addApiKey(
      {
        type: "apiKey",
        name: "X-API-KEY",
        in: "header",
      },
      "api-key",
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 API Gateway is running on: http://localhost:${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
