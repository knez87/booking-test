import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { prisma } from "@booking-journey/shared/database"
import type {
  OrderRequest,
  OrderInfo,
  OrderDetails,
  AvailableRoom,
  AvailablePackage,
} from "@booking-journey/shared/types"

@Injectable()
export class OrderService {
  async createOrder(orderData: OrderRequest): Promise<OrderInfo> {
    // Generate unique booking reference
    const bookingReference = this.generateBookingReference()

    try {
      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
        // Create the order
        const order = await tx.order.create({
          data: {
            availability_id: orderData.availability_id,
            customer_id: Number.parseInt(orderData.customer_id),
            booking_reference: bookingReference,
            status: "pending",
            layout: orderData.layout,
            room_id: orderData.room_id,
            additional_notes: orderData.additional_notes,
            host_name: orderData.host_name,
            event_name: orderData.event_name,
            discount_code: orderData.discount_code,
            currency: "EUR",
            delegates: orderData.delegates,
            start_date: orderData.start_date ? new Date(orderData.start_date) : null,
            end_date: orderData.end_date ? new Date(orderData.end_date) : null,
          },
        })

        // Create order items for addons
        if (orderData.addons && orderData.addons.length > 0) {
          for (const addon of orderData.addons) {
            // Get addon details for pricing
            const addonDetails = await tx.addon.findUnique({
              where: { id: addon.id },
            })

            if (!addonDetails) {
              throw new BadRequestException(`Addon with ID ${addon.id} not found`)
            }

            await tx.orderItem.create({
              data: {
                order_id: order.id,
                addon_id: addon.id,
                name: addonDetails.description,
                product: addonDetails.category,
                quantity: addon.quantity,
                unit: addonDetails.unit,
                unit_price: addonDetails.amount,
                unit_price_inc_tax: addonDetails.amount_inc_tax,
                amount: addonDetails.amount.mul(addon.quantity),
                amount_inc_tax: addonDetails.amount_inc_tax.mul(addon.quantity),
                is_package_content: false,
              },
            })
          }

          // Calculate total amount
          const totalAmount = await tx.orderItem.aggregate({
            where: { order_id: order.id },
            _sum: { amount_inc_tax: true },
          })

          // Update order with total amount
          await tx.order.update({
            where: { id: order.id },
            data: {
              amount_inc_tax: totalAmount._sum.amount_inc_tax || 0,
            },
          })
        }

        return order
      })

      return {
        id: result.id.toString(),
        booking_reference: bookingReference,
      }
    } catch (error) {
      throw new BadRequestException(`Failed to create order: ${error.message}`)
    }
  }

  async getOrderDetails(id: string): Promise<OrderDetails> {
    const order = await prisma.order.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        customer: true,
        room: {
          include: {
            venue: true,
          },
        },
        items: {
          include: {
            addon: true,
          },
        },
      },
    })

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`)
    }

    return this.mapOrderToResponse(order)
  }

  async updateOrderStatus(id: string, status: string, notes?: string): Promise<OrderDetails> {
    const order = await prisma.order.update({
      where: { id: Number.parseInt(id) },
      data: {
        status,
        ...(notes && { additional_notes: notes }),
        updated_at: new Date(),
      },
      include: {
        customer: true,
        room: {
          include: {
            venue: true,
          },
        },
        items: {
          include: {
            addon: true,
          },
        },
      },
    })

    return this.mapOrderToResponse(order)
  }

  async getOrderMessages(orderId: string): Promise<any[]> {
    const messages = await prisma.orderMessage.findMany({
      where: { order_id: Number.parseInt(orderId) },
      orderBy: { created_at: "asc" },
    })

    return messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      sender: msg.sender,
      created_at: msg.created_at.toISOString(),
    }))
  }

  async sendOrderMessage(orderId: string, message: string, sender: string): Promise<any> {
    const orderMessage = await prisma.orderMessage.create({
      data: {
        order_id: Number.parseInt(orderId),
        message,
        sender,
      },
    })

    return {
      id: orderMessage.id,
      message: orderMessage.message,
      sender: orderMessage.sender,
      created_at: orderMessage.created_at.toISOString(),
    }
  }

  async getMeetingRoomAvailability(roomId: number, params: any): Promise<AvailableRoom> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        venue: true,
      },
    })

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`)
    }

    // Check for existing bookings (simplified - in production, you'd check actual availability)
    const existingBookings = await prisma.order.count({
      where: {
        room_id: roomId,
        status: { in: ["confirmed", "pending"] },
        ...(params.start_date &&
          params.end_date && {
            OR: [
              {
                start_date: {
                  lte: new Date(params.end_date),
                },
                end_date: {
                  gte: new Date(params.start_date),
                },
              },
            ],
          }),
      },
    })

    const isAvailable = existingBookings === 0

    return {
      availability_id: `room_${roomId}_${Date.now()}`,
      name: room.name,
      id: room.id,
      venue_id: room.venue_id,
      min_delegates: room.min_delegates,
      max_delegates: room.max_delegates,
      amount_inc_tax: 15000, // This would come from pricing rules
      amount: 12500,
      currency: room.venue.currency,
      instant_bookable: room.instant_bookable && isAvailable,
      credit_card_required: room.credit_card_required,
      description: room.description,
      images: room.images || [],
      equipments: room.equipments || [],
      layouts: room.layouts || [],
      dimensions: room.dimensions,
    }
  }

  async getPackageAvailability(packageId: number, params: any): Promise<AvailablePackage> {
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        venue: true,
      },
    })

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${packageId} not found`)
    }

    return {
      availability_id: `package_${packageId}_${Date.now()}`,
      name: pkg.name,
      min_delegates: pkg.min_delegates,
      max_delegates: pkg.max_delegates,
      amount_inc_tax: 45000, // This would come from pricing rules
      amount: 37500,
      price_adjusted_for_min_delegates: false,
      rooms: pkg.rooms || [],
      info: pkg.info,
      includes: pkg.includes || [],
    }
  }

  async getCustomerOrders(customerId: string, params: any): Promise<OrderDetails[]> {
    const orders = await prisma.order.findMany({
      where: {
        customer_id: Number.parseInt(customerId),
        ...(params.status && { status: params.status }),
      },
      include: {
        customer: true,
        room: {
          include: {
            venue: true,
          },
        },
        items: {
          include: {
            addon: true,
          },
        },
      },
      orderBy: { created_date: "desc" },
      take: params.limit || 50,
      skip: params.offset || 0,
    })

    return orders.map(this.mapOrderToResponse)
  }

  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `BK${timestamp}${random}`.toUpperCase()
  }

  private mapOrderToResponse(order: any): OrderDetails {
    return {
      id: order.id,
      booking_reference: order.booking_reference,
      status: order.status,
      created_date: order.created_date.toISOString(),
      currency: order.currency || "EUR",
      amount_inc_tax: Number(order.amount_inc_tax) || 0,
      provisional_hold_date: order.provisional_hold_date?.toISOString(),
      host_name: order.host_name,
      event_name: order.event_name,
      start: order.start_date?.toISOString() || new Date().toISOString(),
      end: order.end_date?.toISOString() || new Date().toISOString(),
      delegates: order.delegates || 0,
      rooms: order.rooms || [],
      items: order.items?.map(this.mapOrderItemToResponse) || [],
      customer: order.customer
        ? {
            id: order.customer.id.toString(),
            email: order.customer.email,
            first_name: order.customer.first_name,
            last_name: order.customer.last_name,
            company: order.customer.company,
            phone: order.customer.phone,
            billing_address: order.customer.billing_address,
          }
        : undefined,
      venue: order.room?.venue
        ? {
            id: order.room.venue.id,
            name: order.room.venue.name,
            address: {
              street: order.room.venue.street,
              postal_code: order.room.venue.postal_code,
              city: order.room.venue.city,
              country: order.room.venue.country,
            },
          }
        : undefined,
    }
  }

  private mapOrderItemToResponse(item: any) {
    return {
      name: item.name,
      product: item.product,
      quantity: item.quantity,
      start_time: item.start_time,
      end_time: item.end_time,
      account_category: item.account_category,
      unit: item.unit,
      unit_price: Number(item.unit_price),
      unit_price_inc_tax: Number(item.unit_price_inc_tax),
      amount: Number(item.amount),
      amount_inc_tax: Number(item.amount_inc_tax),
      is_package_content: item.is_package_content,
    }
  }
}
