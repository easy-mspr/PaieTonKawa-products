import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_packages')
export class ProductPackage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'productid'})
    productId: number;

    @Column({ type: 'int' })
    weight: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Product, product => product.packages)
    @JoinColumn({ name: "productid" })
    product: Product;
}
