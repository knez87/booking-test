import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("order_messages")
export class OrderMessageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  order_id: number

  @Column("text")
  message: string

  @Column()
  sender: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date
}
