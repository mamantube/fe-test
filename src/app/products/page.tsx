"use client";
import { useEffect, useState } from "react";
import { Table, Input, Space, Typography, Button, Form, Modal, InputNumber, message } from "antd";
import Link from "next/link";
import axios from "axios";

const { Title } = Typography;
const { Search, TextArea } = Input;

interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_category?: string;
  product_description?: string;
  product_image?: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const allProducts = async (query?: string) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/products", {
        params: {
          page: 1,
          limit: 10,
          search: query || "",
        },
      });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      allProducts(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue(product);
    } else {
      setEditingProduct(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        await axios.put("/api/product", {
          ...values,
          product_id: editingProduct.product_id,
        });
        message.success("Product updated successfully");
      } else {
        await axios.post("/api/product", values);
        message.success("Product created successfully");
      }
      setIsModalOpen(false);
      allProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
      message.error("Failed to save product");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "product_title", key: "title" },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "price",
      render: (value: number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(value),
    },
    { title: "Category", dataIndex: "product_category", key: "category" },
    {
      title: "Description",
      dataIndex: "product_description",
      key: "desc",
      render: (text?: string) => (text ? text.slice(0, 50) : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space>
          <Button onClick={() => openModal(record)}>Edit</Button>
          <Button>
            <Link href={`/products/${record.product_id}`}>View</Link>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={3}>Product List</Title>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Search
            placeholder="Search product..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
          <Button type="primary" onClick={() => openModal()}>
            + Add Product
          </Button>
        </Space>

        <Table
          loading={loading}
          columns={columns}
          dataSource={products}
          rowKey="product_id"
          pagination={false}
        />
      </Space>

      {/* Modal Form */}
      <Modal
        title={editingProduct ? "Edit Product" : "Create Product"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editingProduct ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Product Title"
            name="product_title"
            rules={[{ required: true, message: "Please input the product title!" }]}
          >
            <Input placeholder="Product title" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="product_price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => value?.replace(/Rp\s?|\./g, "") || ""}
            />
          </Form.Item>

          <Form.Item label="Category" name="product_category">
            <Input placeholder="Category (optional)" />
          </Form.Item>

          <Form.Item label="Description" name="product_description">
            <TextArea rows={3} placeholder="Description (optional)" />
          </Form.Item>

          <Form.Item label="Image URL" name="product_image">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
