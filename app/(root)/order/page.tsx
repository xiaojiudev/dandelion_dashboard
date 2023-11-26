'use client'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Divider, List, Popover, Row, Space, Table, Tag, message, theme } from 'antd'
import { ColumnsType } from 'antd/es/table';
import { getSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'


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
                <Button onClick={() => cancelOrder(record.id)} icon={<CloseOutlined className=''/>} />
                <Button onClick={() => acceptOrder(record.id)} icon={<CheckOutlined />} type='primary' />
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

const cancelOrder = (id: string) => {

}

const acceptOrder = (id: string) => {

}

export default function Order() {
    const { token: { colorBgContainer }, } = theme.useToken();
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const session = await getSession();

            if (!session) {
                message.error('User not authenticated');
                return;
            }

            const accessToken = session.accessToken;

            const response = await fetch('http://localhost:8080/api/v1/orders/all', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                setOrders(data);
            } else {

                message.error(`Failed to fetch orders: ${response.statusText}`);
            }
        } catch (error) {
            message.error(`Error fetching orders: ${error}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Order</Breadcrumb.Item>
                <Breadcrumb.Item>All Orders</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                <div>
                    <Table columns={columns} dataSource={orders} bordered loading={loading} />
                </div>
            </div>
        </>
    )
}


