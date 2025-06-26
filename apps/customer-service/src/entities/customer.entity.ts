import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("customers")
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  company: string

  @Column({ nullable: true })
  phone: string

  @Column("json", { nullable: true })
  billing_address: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date
}
