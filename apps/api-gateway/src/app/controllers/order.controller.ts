import { Controller, Post, Get, Put, Body, Param, Query } from "@nestjs/common"
import type { ClientProxy } from "@nestjs/microservices"
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from "@nestjs/swagger"
import type {
  OrderRequest,
  OrderInfo,
  OrderDetails,
  AvailableRoom,
  AvailablePackage,
} from "@booking-journey/shared/types"

@ApiTags("Orders")
@Controller("api")
export class OrderController {
  private readonly orderService: ClientProxy

  constructor(orderService: ClientProxy) {
    this.orderService = orderService
  }

  @Post("orders")
  @ApiOperation({ summary: "Create new order" })
  @ApiBody({ description: "Order data" })
  @ApiResponse({ status: 201, description: "Order created successfully" })
  async createOrder(@Body() orderData: OrderRequest): Promise<OrderInfo> {
    return this.orderService.send("order.create", orderData).toPromise()
  }

  @Get("orders/:id")
  @ApiOperation({ summary: "Get order details" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({ status: 200, description: "Order details" })
  async getOrderDetails(@Param('id') id: string): Promise<OrderDetails> {
    return this.orderService.send("order.details", { id }).toPromise()
  }

  @Put("orders/:id")
  @ApiOperation({ summary: "Update order status" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiBody({ description: "Status update data" })
  @ApiResponse({ status: 200, description: "Order updated successfully" })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateData: { status: string; notes?: string },
  ): Promise<OrderDetails> {
    return this.orderService.send("order.update", { id, ...updateData }).toPromise()
  }

  @Get("orders/:id/messages")
  @ApiOperation({ summary: "Get order messages" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({ status: 200, description: "Order messages" })
  async getOrderMessages(@Param('id') id: string): Promise<any[]> {
    return this.orderService.send("order.messages.get", { id }).toPromise()
  }

  @Post("orders/:id/messages")
  @ApiOperation({ summary: "Send order message" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiBody({ description: "Message data" })
  @ApiResponse({ status: 201, description: "Message sent successfully" })
  async sendOrderMessage(
    @Param('id') id: string,
    @Body() messageData: { message: string; sender: string },
  ): Promise<any> {
    return this.orderService.send("order.messages.send", { id, ...messageData }).toPromise()
  }

  // Meeting room availability endpoints
  @Get("availability/meetingrooms/:id")
  @ApiOperation({ summary: "Get meeting room availability" })
  @ApiParam({ name: "id", description: "Room ID" })
  @ApiResponse({ status: 200, description: "Room availability" })
  async getMeetingRoomAvailability(@Param('id') id: number, @Query() params: any): Promise<AvailableRoom> {
    return this.orderService.send("availability.meetingroom", { id, ...params }).toPromise()
  }

  @Get("availability/packages/:id")
  @ApiOperation({ summary: "Get package availability" })
  @ApiParam({ name: "id", description: "Package ID" })
  @ApiResponse({ status: 200, description: "Package availability" })
  async getPackageAvailability(@Param('id') id: number, @Query() params: any): Promise<AvailablePackage> {
    return this.orderService.send("availability.package", { id, ...params }).toPromise()
  }
}
