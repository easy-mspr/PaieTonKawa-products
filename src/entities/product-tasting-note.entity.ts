//import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
//import { Product } from './product.entity';
//
//@Entity()
//export class ProductTastingNote {
//    @PrimaryGeneratedColumn()
//    id: number;
//
//    @Column()
//    productId: number;
//
//    @Column({ type: 'varchar', length: 255 })
//    note: string;
//
//    @ManyToOne(() => Product, product => product.tastingNotes, { onDelete: 'CASCADE' })
//    product: Product;
//}
