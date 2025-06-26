import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("venues")
export class VenueEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  street: string

  @Column()
  postal_code: string

  @Column()
  city: string

  @Column()
  country: string

  @Column("decimal", { precision: 10, scale: 8 })
  latitude: number

  @Column("decimal", { precision: 11, scale: 8 })
  longitude: number

  @Column({ nullable: true })
  summary: string

  @Column("json", { nullable: true })
  images: string

  @Column()
  currency: string

  @Column({ nullable: true })
  max_delegates: number

  @Column({ nullable: true })
  starting_price_cents: number

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date
}
