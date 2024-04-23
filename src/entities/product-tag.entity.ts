//import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
//import { Product } from './product.entity';
//
//@Entity()
//export class ProductTag {
//    @PrimaryGeneratedColumn()
//    id: number;
//
//    @Column()
//    productId: number;
//
//    @Column({ type: 'varchar', length: 255 })
//    tag: string;
//
//    @ManyToOne(() => Product, product => product.tags, { onDelete: 'CASCADE' })
//    product: Product;
//}
