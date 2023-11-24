'use client'
import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useSWR from 'swr';
import Image from 'next/image';

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
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

                    const randomColor = colors[Math.floor(Math.random() * colors.length)];

                    return (
                        <Tag color={randomColor} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        ),
    },
];


export default function Product() {



    const { data, error, isLoading } = useSWR("http://localhost:8080/api/v1/products?size=1000", fetcher)

    console.log(data);


    const dataSource: DataType[] = data?.content?.map((item: any, index: number) => ({
        key: String(index),
        id: String(item.id),
        name: item.name,
        image: <img src={`${item.media_url}`} alt='Card' sizes="100vw" width={500} height={300} className='h-14 rounded-sm w-full object-cover' />,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        tags: item.tag.split(','),
    }))

    return (
        <>
            {/* <img src={`https://pixahive.com/wp-content/uploads/2020/10/Gym-shoes-153180-pixahive.jpg`} alt='Card' sizes="100vw" width={500} height={300} className='h-44 rounded-2xl w-full object-cover' /> */}
            <Table columns={columns} dataSource={dataSource} />
        </>
    )
}
