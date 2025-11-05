"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, Typography, Space, Image, Button, Spin, message } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product?product_id=${id}`);
        setProduct(response.data.data);
      } catch (error) {
        message.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", paddingTop: 100 }}>
        <Text type="danger">Product not found</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => router.push("/products")} style={{ marginBottom: 16 }}>
        ← Back to Products
      </Button>

      <Card
        style={{ maxWidth: 800, margin: "0 auto", borderRadius: 12 }}
        cover={
          product.product_image ? (
            <Image
              alt={product.product_title}
              src={product.product_image}
              width="100%"
              height={400}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: 400,
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text type="secondary">No Image Available</Text>
            </div>
          )
        }
      >
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Title level={3}>{product.product_title}</Title>
          <Text strong style={{ fontSize: 18 }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.product_price)}
          </Text>
          {product.product_category && (
            <Text type="secondary">Category: {product.product_category}</Text>
          )}
          <Paragraph style={{ marginTop: 16 }}>
            {product.product_description || "No description available."}
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
}