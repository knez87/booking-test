import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import type { OrderService } from "./order.service"
import type {
  OrderRequest,
  OrderInfo,
  OrderDetails,
  AvailableRoom,
  AvailablePackage,
} from "@booking-journey/shared/types"

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern("order.create")
  async createOrder(data: OrderRequest): Promise<OrderInfo> {
    return this.orderService.createOrder(data)
  }

  @MessagePattern("order.details")
  async getOrderDetails(data: { id: string }): Promise<OrderDetails> {
    return this.orderService.getOrderDetails(data.id)
  }

  @MessagePattern("order.update")
  async updateOrder(data: { id: string; status: string; notes?: string }): Promise<OrderDetails> {
    return this.orderService.updateOrderStatus(data.id, data.status, data.notes)
  }

  @MessagePattern("order.messages.get")
  async getOrderMessages(data: { id: string }): Promise<any[]> {
    return this.orderService.getOrderMessages(data.id)
  }

  @MessagePattern("order.messages.send")
  async sendOrderMessage(data: { id: string; message: string; sender: string }): Promise<any> {
    return this.orderService.sendOrderMessage(data.id, data.message, data.sender)
  }

  @MessagePattern("availability.meetingroom")
  async getMeetingRoomAvailability(data: any): Promise<AvailableRoom> {
    return this.orderService.getMeetingRoomAvailability(data.id, data)
  }

  @MessagePattern("availability.package")
  async getPackageAvailability(data: any): Promise<AvailablePackage> {
    return this.orderService.getPackageAvailability(data.id, data)
  }
}
