import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
//import { ProductTag } from './product-tag.entity';
import { ProductPackage } from './product-package.entity';
//import { ProductTastingNote } from './product-tasting-note.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'createdat', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedat', type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({
        name: 'saletype',
        type: 'enum',
        enum: ['packaged', 'unit'],
        default: 'packaged'
    })
    saleType: 'packaged' | 'unit';

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    origin: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    variety: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    process: string;

    @Column({name: 'roastlevel', type: 'varchar', length: 255, nullable: true })
    roastLevel: string;

    @Column({ type: 'int' })
    stock: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    category: string;

    @Column({name: 'priceperkg', type: 'decimal', precision: 10, scale: 2 })
    pricePerKg: number;
    // pricePerKg if -> saleType = packaged

    //@OneToMany(() => ProductTag, productTag => productTag.product)
    //tags: ProductTag[];

    @OneToMany(() => ProductPackage, productPackage => productPackage.product)
    packages: ProductPackage[];

    //@OneToMany(() => ProductTastingNote, productTastingNote => productTastingNote.product)
    //tastingNotes: ProductTastingNote[];
}
