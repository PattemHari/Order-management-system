from pydantic import BaseModel

class Users(BaseModel):
    id: int
    name: str
    email: str
    role: str
    password: str
    address: str

class ProductBase(BaseModel):
    id: int | None = None
    name: str
    description: str
    price: int
    imageUrl: str

class CartBase(BaseModel):
    id: int
    userId: int
    productId: int
    productName: str
    price: float
    quantity: int

class OrderDetail(BaseModel):
    id: int
    user_id: int
    product_id: int
    product_name: str
    quantity: int
    price: float
    total_price: float
    order_status: str
    created_at: str

class ProductDetail(BaseModel):
    id: int
    name: str
    description: str
    price: int

class OrderWithProduct(BaseModel):
    order: OrderDetail
    product: ProductDetail
