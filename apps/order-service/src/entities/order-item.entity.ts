import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { OrderEntity } from "./order.entity"

@Entity("order_items")
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  order_id: number

  @Column({ nullable: true })
  addon_id: number

  @Column()
  name: string

  @Column()
  product: string

  @Column()
  quantity: number

  @Column({ nullable: true })
  start_time: string

  @Column({ nullable: true })
  end_time: string

  @Column({ nullable: true })
  account_category: string

  @Column()
  unit: string

  @Column("decimal", { precision: 10, scale: 2 })
  unit_price: number

  @Column("decimal", { precision: 10, scale: 2 })
  unit_price_inc_tax: number

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number

  @Column("decimal", { precision: 10, scale: 2 })
  amount_inc_tax: number

  @Column({ default: false })
  is_package_content: boolean

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @ManyToOne(
    () => OrderEntity,
    (order) => order.items,
  )
  @JoinColumn({ name: "order_id" })
  order: OrderEntity
}
