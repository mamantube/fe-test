import { NextResponse } from "next/server";
import axios from "axios";

const baseUrl = "http://localhost:8001/api/web/v1"


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");

  try {
    const response = await axios.get(`${baseUrl}/product`, {
      params: { product_id: productId },
    });
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Fetching product failed:", err.message);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await axios.post(`${baseUrl}/product`, body);
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Error creating product:", err.message);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
    try {
    const body = await request.json();
    const res = await axios.put(`${baseUrl}/product`, body);
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Error updating product:", err.message);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}