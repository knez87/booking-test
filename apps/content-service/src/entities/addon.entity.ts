import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("addons")
export class AddonEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  venue_id: number

  @Column()
  description: string

  @Column()
  category: string

  @Column()
  currency: string

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number

  @Column("decimal", { precision: 10, scale: 2 })
  amount_inc_tax: number

  @Column()
  unit: string

  @Column("json", { nullable: true })
  available_rooms: string

  @Column({ default: false })
  package_addon: boolean

  @Column("json", { nullable: true })
  available_packages: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date
}
