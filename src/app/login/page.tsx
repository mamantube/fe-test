"use client"

import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/FirebaseClients";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const { email, password } = values;
      await signInWithEmailAndPassword(auth, email, password);
      message.success("Login berhasil!");
      router.push("/products");
    } catch (error: any) {
      message.error(error.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  if (user) router.push("/products");

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <Title level={3} className="text-center mb-6">
          Login
        </Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="Masukkan email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Masukkan password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}