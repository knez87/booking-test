import { Controller, Post, Body } from "@nestjs/common"
import type { ClientProxy } from "@nestjs/microservices"
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger"
import type { NewCustomer, Customer } from "@booking-journey/shared/types"

@ApiTags("Customer")
@Controller("api/customers")
export class CustomerController {
  private readonly customerService: ClientProxy

  constructor(customerService: ClientProxy) {
    this.customerService = customerService
  }

  @Post()
  @ApiOperation({ summary: "Create new customer" })
  @ApiBody({ description: "Customer data" })
  @ApiResponse({ status: 201, description: "Customer created successfully" })
  async createCustomer(@Body() customerData: NewCustomer): Promise<Customer> {
    return this.customerService.send("customer.create", customerData).toPromise()
  }
}
