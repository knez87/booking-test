import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import type { CustomerService } from "./customer.service"
import type { NewCustomer, Customer } from "@booking-journey/shared/types"

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern("customer.create")
  async createCustomer(data: NewCustomer): Promise<Customer> {
    return this.customerService.createCustomer(data)
  }
}
