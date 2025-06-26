import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { prisma } from "@booking-journey/shared/database"
import type { NewCustomer, Customer } from "@booking-journey/shared/types"

@Injectable()
export class CustomerService {
  async createCustomer(customerData: NewCustomer): Promise<Customer> {
    try {
      const customer = await prisma.customer.create({
        data: {
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          email: customerData.email.toLowerCase(),
          company: customerData.company,
          phone: customerData.phone,
          billing_address: customerData.billing_address,
        },
      })

      return this.mapCustomerToResponse(customer)
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        throw new ConflictException("Customer with this email already exists")
      }
      throw error
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    const customer = await prisma.customer.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`)
    }

    return this.mapCustomerToResponse(customer)
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    })

    return customer ? this.mapCustomerToResponse(customer) : null
  }

  async updateCustomer(id: string, customerData: Partial<NewCustomer>): Promise<Customer> {
    try {
      const customer = await prisma.customer.update({
        where: { id: Number.parseInt(id) },
        data: {
          ...(customerData.first_name && { first_name: customerData.first_name }),
          ...(customerData.last_name && { last_name: customerData.last_name }),
          ...(customerData.email && { email: customerData.email.toLowerCase() }),
          ...(customerData.company && { company: customerData.company }),
          ...(customerData.phone && { phone: customerData.phone }),
          ...(customerData.billing_address && { billing_address: customerData.billing_address }),
          updated_at: new Date(),
        },
      })

      return this.mapCustomerToResponse(customer)
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        throw new ConflictException("Customer with this email already exists")
      }
      if (error.code === "P2025") {
        throw new NotFoundException(`Customer with ID ${id} not found`)
      }
      throw error
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      await prisma.customer.delete({
        where: { id: Number.parseInt(id) },
      })
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Customer with ID ${id} not found`)
      }
      throw error
    }
  }

  async searchCustomers(query: string, limit = 20, offset = 0): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { first_name: { contains: query, mode: "insensitive" } },
          { last_name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      skip: offset,
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
    })

    return customers.map(this.mapCustomerToResponse)
  }

  private mapCustomerToResponse(customer: any): Customer {
    return {
      id: customer.id.toString(),
      email: customer.email,
      company: customer.company,
      phone: customer.phone,
      first_name: customer.first_name,
      last_name: customer.last_name,
      billing_address: customer.billing_address,
    }
  }
}
