import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { OrderEntity } from "../entities/order.entity"
import type { OrderItemEntity } from "../entities/order-item.entity"
import type { OrderMessageEntity } from "../entities/order-message.entity"
import type {
  OrderRequest,
  OrderInfo,
  OrderDetails,
  AvailableRoom,
  AvailablePackage,
} from "@booking-journey/shared/types"

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    private readonly orderMessageRepository: Repository<OrderMessageEntity>,
  ) {}

  async createOrder(orderData: OrderRequest): Promise<OrderInfo> {
    // Generate unique booking reference
    const bookingReference = this.generateBookingReference()

    const order = this.orderRepository.create({
      availability_id: orderData.availability_id,
      customer_id: orderData.customer_id,
      booking_reference: bookingReference,
      status: "pending",
      layout: orderData.layout,
      room_id: orderData.room_id,
      additional_notes: orderData.additional_notes,
      host_name: orderData.host_name,
      event_name: orderData.event_name,
      discount_code: orderData.discount_code,
      created_date: new Date(),
    })

    const savedOrder = await this.orderRepository.save(order)

    // Create order items for addons
    if (orderData.addons && orderData.addons.length > 0) {
      for (const addon of orderData.addons) {
        const orderItem = this.orderItemRepository.create({
          order_id: savedOrder.id,
          addon_id: addon.id,
          quantity: addon.quantity,
        })
        await this.orderItemRepository.save(orderItem)
      }
    }

    return {
      id: savedOrder.id.toString(),
      booking_reference: bookingReference,
    }
  }

  async getOrderDetails(id: string): Promise<OrderDetails> {
    const order = await this.orderRepository.findOne({
      where: { id: Number.parseInt(id) },
      relations: ["items", "customer"],
    })

    if (!order) {
      throw new Error("Order not found")
    }

    return this.mapOrderEntityToOrderDetails(order)
  }

  async updateOrderStatus(id: string, status: string, notes?: string): Promise<OrderDetails> {
    const order = await this.orderRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!order) {
      throw new Error("Order not found")
    }

    order.status = status
    if (notes) {
      order.additional_notes = notes
    }

    await this.orderRepository.save(order)
    return this.getOrderDetails(id)
  }

  async getOrderMessages(orderId: string): Promise<any[]> {
    const messages = await this.orderMessageRepository.find({
      where: { order_id: Number.parseInt(orderId) },
      order: { created_at: "ASC" },
    })

    return messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      sender: msg.sender,
      created_at: msg.created_at,
    }))
  }

  async sendOrderMessage(orderId: string, message: string, sender: string): Promise<any> {
    const orderMessage = this.orderMessageRepository.create({
      order_id: Number.parseInt(orderId),
      message,
      sender,
      created_at: new Date(),
    })

    const savedMessage = await this.orderMessageRepository.save(orderMessage)

    return {
      id: savedMessage.id,
      message: savedMessage.message,
      sender: savedMessage.sender,
      created_at: savedMessage.created_at,
    }
  }

  async getMeetingRoomAvailability(roomId: number, params: any): Promise<AvailableRoom> {
    // Implementation for meeting room availability
    // This would typically check availability against bookings
    return {
      availability_id: `room_${roomId}_${Date.now()}`,
      name: "Sample Room",
      id: roomId,
      venue_id: 1,
      min_delegates: 2,
      max_delegates: 20,
      amount_inc_tax: 15000,
      amount: 12500,
      currency: "EUR",
      instant_bookable: true,
      credit_card_required: false,
      images: [],
      equipments: [],
      layouts: [],
    }
  }

  async getPackageAvailability(packageId: number, params: any): Promise<AvailablePackage> {
    // Implementation for package availability
    return {
      availability_id: `package_${packageId}_${Date.now()}`,
      name: "Sample Package",
      min_delegates: 10,
      max_delegates: 50,
      amount_inc_tax: 45000,
      amount: 37500,
      price_adjusted_for_min_delegates: false,
      rooms: [1, 2],
      includes: [],
    }
  }

  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `BK${timestamp}${random}`.toUpperCase()
  }

  private mapOrderEntityToOrderDetails(entity: any): OrderDetails {
    return {
      id: entity.id,
      status: entity.status,
      created_date: entity.created_date.toISOString(),
      currency: entity.currency || "EUR",
      amount_inc_tax: entity.amount_inc_tax || 0,
      provisional_hold_date: entity.provisional_hold_date?.toISOString(),
      host_name: entity.host_name,
      event_name: entity.event_name,
      start: entity.start_date?.toISOString() || new Date().toISOString(),
      end: entity.end_date?.toISOString() || new Date().toISOString(),
      delegates: entity.delegates || 0,
      rooms: entity.rooms ? JSON.parse(entity.rooms) : [],
      items: entity.items ? entity.items.map(this.mapOrderItemEntityToOrderItem) : [],
    }
  }

  private mapOrderItemEntityToOrderItem(entity: any) {
    return {
      name: entity.name || "Order Item",
      product: entity.product || "Service",
      quantity: entity.quantity,
      start_time: entity.start_time,
      end_time: entity.end_time,
      account_category: entity.account_category,
      unit: entity.unit || "piece",
      unit_price: entity.unit_price || 0,
      unit_price_inc_tax: entity.unit_price_inc_tax || 0,
      amount: entity.amount || 0,
      amount_inc_tax: entity.amount_inc_tax || 0,
      is_package_content: entity.is_package_content || false,
    }
  }
}
