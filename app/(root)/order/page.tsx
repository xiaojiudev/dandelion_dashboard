'use client'
import React, { useEffect, useState } from 'react'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Divider, List, Popover, Row, Space, Table, Tag, message, theme } from 'antd'
import { ColumnsType } from 'antd/es/table';
import { getSession } from 'next-auth/react';
import useSWR, { mutate, useSWRConfig } from 'swr';



enum OrderStatus {
    TO_PAY = "TO_PAY",
    PROCESSING = "PROCESSING",
    DELIVERING = "DELIVERING",
    CANCELED = "CANCELED",
    COMPLETED = "COMPLETED",
    REFUND = "REFUND",
}

interface OrderType {
    key: string;
    id: string;
    tracking_code: string;
    user_full_name: string;
    shipping_address: string;
    merchandise_total: number;
    total: number;
    shipping_fee: number;
    payment_method: string;
    order_status: string;
    transaction_status: string;
    order_details: OrderDetail[];
}

interface OrderDetail {
    id: string;
    quantity: number;
    price: number;
    media_url: string;
    product_name: string;
}






export default function Order() {
    const { token: { colorBgContainer }, } = theme.useToken();
    // const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const columns: ColumnsType<OrderType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tracking Code',
            dataIndex: 'tracking_code',
            key: 'tracking_code',
        },
        {
            title: 'User Full Name',
            dataIndex: 'user_full_name',
            key: 'user_full_name',
            render: (_, record) => (
                <Space size="middle">
                    <Popover content={record.shipping_address.replace(/ null,?/g, "").trim()} title="User Details" trigger="click">
                        <Button type="link">{record.user_full_name}</Button>
                    </Popover>
                </Space>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Order Details',
            key: 'order_details',
            render: (_, record) => (
                <Space size="middle">
                    {renderOrderDetails(record.order_details, record.merchandise_total, record.shipping_fee, record.total)}
                </Space>
            ),
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (text) => (
                <Tag color="cyan">{text}</Tag>
            )
        },
        {
            title: 'Transaction Status',
            dataIndex: 'transaction_status',
            key: 'transaction_status',
            render: (text) => (
                <Tag color="gold">{text}</Tag>
            )
        },
        {
            title: 'Order Status',
            dataIndex: 'order_status',
            key: 'order_status',
            render: (text) => (
                <Tag color="volcano">{text}</Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => setOrderStatus(record.id, OrderStatus.CANCELED)} icon={<CloseOutlined style={{ color: '#e93445' }} />} />
                    <Button onClick={() => setOrderStatus(record.id, OrderStatus.DELIVERING)} icon={<CheckOutlined style={{ color: '#1cc487' }} />} />
                </Space>
            ),
        },

    ];

    const renderOrderDetails = (orderDetails: OrderDetail[], merchandise_total: number, shipping_fee: number, total: number) => {
        const content = (
            <div className='w-[400px]'>
                <Row gutter={[16, 0]} align="middle" justify="space-around" >
                    {orderDetails.map((detail) => (
                        <React.Fragment key={detail.id}>
                            <Col span={4} >
                                <Avatar shape='square' src={detail.media_url} size={40} className='object-cover' />
                            </Col>
                            <Col span={8} >{detail.product_name}</Col>
                            <Col span={4} >{(detail.price).toFixed(2)}</Col>
                            <Col span={4} >x{detail.quantity}</Col>
                            <Col span={4} >{(detail.price * detail.quantity).toFixed(2)}</Col>
                            <Divider />
                        </React.Fragment>
                    ))}
                    <Col span={20}>Merchandise Total:</Col>
                    <Col span={4}>${merchandise_total.toFixed(2)}</Col>
                    <Col span={20}>Shipping Fee:</Col>
                    <Col span={4}>${shipping_fee.toFixed(2)}</Col>
                    <Col span={20}>Total:</Col>
                    <Col span={4}>${total.toFixed(2)}</Col>
                </Row >

            </div >
        );
        return (
            <Popover content={content} title="Order Details" trigger="click">
                <Button type="link">Details</Button>
            </Popover>
        );
    };

    const { data: orders, error: ordersError, isLoading, mutate: mutateOrders } = useSWR(
        `${process.env.baseURI}/orders/all`,
        async (url) => {
            try {
                const session = await getSession();

                if (!session) {
                    throw new Error('User not authenticated');
                }

                const accessToken = session.accessToken;

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.statusText}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                throw new Error(`Error fetching orders: ${error}`);
            }
        }
    );

    const setOrderStatus = async (id: string, status: OrderStatus) => {
        try {
            setLoading(true)
            const session = await getSession();

            if (!session) {
                message.error('User not authenticated');
                return;
            }

            const accessToken = session.accessToken;

            const response = await fetch(`${process.env.baseURI}/orders/${id}/update/${status}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                message.success(`Order ${id} ${status} successfully`);

                mutateOrders();
            } else {
                message.error(`Failed to ${status} order ${id}`);
            }
        } catch (error) {
            message.error(`Something went wrong ${error}`);
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Order</Breadcrumb.Item>
                <Breadcrumb.Item>All Orders</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                <div>
                    <Table columns={columns} dataSource={orders} bordered loading={loading || isLoading} />
                </div>
            </div>
        </>
    )
}


