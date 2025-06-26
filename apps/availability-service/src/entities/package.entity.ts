import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("packages")
export class PackageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  venue_id: number

  @Column()
  name: string

  @Column()
  min_delegates: number

  @Column()
  max_delegates: number

  @Column("json", { nullable: true })
  rooms: string

  @Column({ nullable: true })
  info: string

  @Column("json", { nullable: true })
  includes: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date
}
