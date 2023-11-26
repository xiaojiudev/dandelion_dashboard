'use client'

import React, { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Select, Spin, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/es/upload';
import { getSession } from 'next-auth/react';
import { mutate } from 'swr';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

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

    const params = useParams()
    const id = params?.id;
    const isEditing = id !== 'news'

    const router = useRouter()

    const [productDetails, setProductDetails] = useState<any>({})
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingProductDetails, setLoadingProductDetails] = useState(true);

    const [form] = Form.useForm();


    useEffect(() => {
        const fetchCategory = async () => {
            const res = await fetch(`${process.env.baseURI}/categories`, {
                method: 'GET',
            });

            const categories = await res.json();

            setCategories(categories);
        };

        fetchCategory();
    }, [])

    useEffect(() => {
        if (isEditing) {
            const fetchProductDetails = async () => {
                try {
                    const res = await fetch(`${process.env.baseURI}/products/${id}`, {
                        method: 'GET',
                    })

                    const productDetails = await res.json();
                    setProductDetails(productDetails);
                    form.setFieldsValue(productDetails);
                } catch (error) {

                } finally {
                    setLoadingProductDetails(false);
                }
            }

            fetchProductDetails();
        } else {
            setLoadingProductDetails(false);
        }
    }, [id, isEditing])

    const onSave = async (values: any) => {
        setIsSaving(true);

        const { name, price, quantity, image, category, description, information } = values;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('information', information);
        if (image) {
            formData.append('media_file', image[0].originFileObj);
        }

        try {
            const session = await getSession();

            console.log(session?.accessToken);


            if (!session) {
                message.error('User not authenticated')
                return;
            }

            const accessToken = session?.accessToken

            const method = isEditing ? 'PATCH' : 'POST';

            const url = isEditing ? `${process.env.baseURI}/products/${id}` : `${process.env.baseURI}/products`

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            })

            if (response.ok) {
                message.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
                router.push('/product')
            } else {
                message.error(`Failed to ${isEditing ? 'update' : 'create'} product`);
            }
            
        } catch (error) {
            console.log('Something went wrong', error);
            message.error('Something went wrong')
        } finally {
            setIsSaving(false);
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
            <Spin spinning={isSaving || loadingProductDetails}>
                <Form
                    {...layout}
                    name="edit_product"
                    onFinish={onSave}
                    style={{ maxWidth: 600 }}
                    validateMessages={validateMessages}
                    form={form}
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
                            {productDetails && productDetails.media_url ?
                                (<div>
                                    <img src={productDetails.media_url} className='w-20 h-20 rounded object-cover' />
                                </div>)
                                : (<div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>)}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        hasFeedback
                        rules={[{ required: true, message: 'Please select your category!' }]}
                    >
                        <Select placeholder="Please select a category">
                            {categories?.map((category) =>
                                <Option value={category?.name} key={category.id}>
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
                        <Button type="primary" htmlType="submit" disabled={isSaving}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
