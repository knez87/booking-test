import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { VenueEntity } from "./venue.entity"

@Entity("rooms")
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  venue_id: number

  @Column()
  min_delegates: number

  @Column()
  max_delegates: number

  @Column({ default: false })
  instant_bookable: boolean

  @Column({ default: false })
  credit_card_required: boolean

  @Column({ nullable: true })
  description: string

  @Column("json", { nullable: true })
  images: string

  @Column("json", { nullable: true })
  equipments: string

  @Column("json", { nullable: true })
  layouts: string

  @Column("json", { nullable: true })
  dimensions: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date

  @ManyToOne(() => VenueEntity)
  @JoinColumn({ name: "venue_id" })
  venue: VenueEntity
}
