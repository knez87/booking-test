import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { OrderItemEntity } from "./order-item.entity"

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  availability_id: string

  @Column()
  customer_id: string

  @Column()
  booking_reference: string

  @Column()
  status: string

  @Column({ nullable: true })
  layout: string

  @Column({ nullable: true })
  room_id: number

  @Column({ nullable: true })
  additional_notes: string

  @Column({ nullable: true })
  host_name: string

  @Column({ nullable: true })
  event_name: string

  @Column({ nullable: true })
  discount_code: string

  @Column({ nullable: true })
  currency: string

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  amount_inc_tax: number

  @Column({ type: "timestamp", nullable: true })
  provisional_hold_date: Date

  @Column({ type: "timestamp", nullable: true })
  start_date: Date

  @Column({ type: "timestamp", nullable: true })
  end_date: Date

  @Column({ nullable: true })
  delegates: number

  @Column("json", { nullable: true })
  rooms: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date

  @OneToMany(
    () => OrderItemEntity,
    (item) => item.order,
  )
  items: OrderItemEntity[]
}
