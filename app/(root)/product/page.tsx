'use client'
import React, { useState } from 'react';
import { Table, Space, Tag, Button, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useSWR, { mutate, useSWRConfig } from 'swr';
import { getSession } from 'next-auth/react';
import Link from 'next/link'



const fetcher = (url: any) => fetch(url).then(res => res.json())

interface DataType {
    key: string;
    id: string;
    name: string;
    image: any;
    price: number;
    quantity: number;
    category: string;
    tags: string[];
}





export default function Product() {

    const columns: ColumnsType<DataType> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a href={`/product/${record.id}`}>Edit</a>
                    <button onClick={() => deleteProduct(record.id)}>Delete</button>
                </Space>
            ),
        },
    ];

    const { data, error, isLoading, mutate } = useSWR(`${process.env.baseURI}/products?size=1000`, fetcher)


    console.log("Data", data);
    console.log("Error", error);
    console.log("Isloading", isLoading);


    const [isDeleting, setIsDeleting] = useState(false);

    const deleteProduct = async (productId: string) => {
        console.log('delete product with id =', productId);

        const session = await getSession();

        if (!session) {
            return;
        }

        const accessToken = session.accessToken;

        try {
            setIsDeleting(true);
            const response = await fetch(`${process.env.baseURI}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.ok) {
                message.success(`Product with ID ${productId} deleted successfully.`);
                mutate()
            } else {
                message.error(`Failed to delete product: ${response.statusText}`,);
            }
        } catch (error) {
            message.error(`Something when wrong while deleting product: ${error}`);
        } finally {
            setIsDeleting(false);
        }
    }


    const dataSource: DataType[] = data?.content?.map((item: any, index: number) => ({
        key: String(index),
        id: String(item.id),
        name: item.name,
        image: <img src={`${item.media_url}`} alt='Card' sizes="100vw" width={500} height={300} className='h-14 rounded-sm w-full object-cover' />,
        price: item.price,
        quantity: item.quantity,
        category: <Tag color={item.category === 'flower' ? 'gold' : 'blue'}>{item.category}</Tag>,
        // tags: item.tag.split(','),
    }))

    return (
        <div>
            <Spin spinning={isLoading || isDeleting}>
                <Button type="primary" className='float-right mb-4' >
                    <Link href="/product/news">Add</Link>
                </Button>
                <Table columns={columns} dataSource={dataSource} bordered />
            </Spin>
        </div>
    )
}
