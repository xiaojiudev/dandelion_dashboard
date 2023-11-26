'use client'

import React, { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Select, Spin, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/es/upload';
import { getSession } from 'next-auth/react';
import { mutate } from 'swr';


const { Option } = Select

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

interface Category {
    id: number;
    name: string;
}


export default function ProductForm() {

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isloading, setIsloading] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await fetch(`${process.env.baseURI}/categories`, {
                method: 'GET',
            });

            const categories = await res.json();

            setCategories(categories);
        }

        fetchCategory();
    }, [])

    const onSave = async (values: any) => {
        console.log(values);
        setIsloading(true);

        const { name, price, quantity, image, categoryId, description, information } = values;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('categoryId', categoryId);
        formData.append('description', description);
        formData.append('information', information);
        formData.append('media_file', image[0].originFileObj);

        try {
            const session = await getSession();

            console.log(session?.accessToken);


            if (!session) {
                message.error('User not authenticated')
                return;
            }

            const accessToken = session?.accessToken

            const response = await fetch(`${process.env.baseURI}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            })

            if (response.ok) {
                message.success('Product created successfully');

                mutate(`${process.env.baseURI}/products?size=1000`);
            } else {
                message.error('Failed to create product');
            }

        } catch (error) {
            console.log('Something went wrong', error);
            message.error('Something went wrong')
        } finally {
            setIsloading(false);
        }

    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const beforeUpload = (file: RcFile) => {
        setFileList([...fileList, file]);
        return false;
    }

    return (
        <div>
            <Spin spinning={isloading}>
                <Form
                    {...layout}
                    name="edit_product"
                    onFinish={onSave}
                    style={{ maxWidth: 600 }}
                    validateMessages={validateMessages}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ type: 'number', min: 0, }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" rules={[{ type: 'number', min: 0, }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Upload" name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload action="" listType="picture-card" beforeUpload={beforeUpload} maxCount={1}>
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="categoryId"
                        label="Category"
                        hasFeedback
                        rules={[{ required: true, message: 'Please select your category!' }]}
                    >
                        <Select placeholder="Please select a category">
                            {categories?.map((category) =>
                                <Option value={category?.id} key={category.id}>
                                    {category.name[0].toUpperCase() + category.name.slice(1)}
                                </Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="information" label="Information">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit" disabled={isloading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
