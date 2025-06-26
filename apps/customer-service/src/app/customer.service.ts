import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { CustomerEntity } from "../entities/customer.entity"
import type { NewCustomer, Customer } from "@booking-journey/shared/types"

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: Repository<CustomerEntity>) {}

  async createCustomer(customerData: NewCustomer): Promise<Customer> {
    const customer = this.customerRepository.create({
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      email: customerData.email,
      company: customerData.company,
      phone: customerData.phone,
      billing_address: customerData.billing_address ? JSON.stringify(customerData.billing_address) : null,
    })

    const savedCustomer = await this.customerRepository.save(customer)

    return {
      id: savedCustomer.id.toString(),
      email: savedCustomer.email,
      company: savedCustomer.company,
      phone: savedCustomer.phone,
      first_name: savedCustomer.first_name,
      last_name: savedCustomer.last_name,
      billing_address: savedCustomer.billing_address ? JSON.parse(savedCustomer.billing_address) : undefined,
    }
  }
}
