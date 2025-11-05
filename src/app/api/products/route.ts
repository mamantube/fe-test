import { NextResponse } from "next/server";
import axios from "axios";

const baseUrl = "http://localhost:8001/api/web/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const search = searchParams.get("search") || "";

  try {
    const res = await axios.get(`${baseUrl}/products`, {
      params: { page, limit, search },
    });
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Error proxying /products:", err.message);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}