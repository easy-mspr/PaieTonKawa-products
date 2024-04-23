// src/rabbitmq/rabbitmq.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection;
    private channel;

    constructor(private configService: ConfigService) {
        const rabbitUrl = this.configService.get<string>('RABBITMQ_URL');
        this.connection = amqp.connect([rabbitUrl]);
        this.channel = this.connection.createChannel({
            json: true,
            setup: channel => {
                return Promise.all([
                    channel.assertQueue('orders_to_products_check_availability', { durable: true }),
                    channel.assertQueue('products_to_orders_availability_response', { durable: true }),
                ]);
            },
            confirm: true,
        });
    }

    async publishToQueue(queueName: string, data: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.channel.sendToQueue(queueName, data, {}, (err, ok) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }  

    async subscribeToQueue(queueName: string, callback: Function) {
        return this.channel.consume(queueName, message => {
            callback(message);
            this.channel.ack(message);
        });
    }

    onModuleInit() {
        console.log('RabbitMQ Service started');
    }

    onModuleDestroy() {
        this.connection.close();
    }
}
