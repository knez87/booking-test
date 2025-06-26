import { Controller, Post, Get, Put, Body, Param } from "@nestjs/common"
import type { ClientProxy } from "@nestjs/microservices"
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from "@nestjs/swagger"
import type { OrderRequest, OrderInfo, OrderDetails } from "@booking-journey/shared/types"

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
}
</merged_code>
