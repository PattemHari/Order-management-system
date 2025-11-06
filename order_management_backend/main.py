from fastapi import Depends, FastAPI
from database import  engine, sessionLocal 
import database_models
import models
from routers import auth
from sqlalchemy.orm import Session
from routers import auth
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_
from typing import Literal

from fastapi import FastAPI, BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, EmailStr

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)
database_models.Base.metadata.create_all(bind=engine)
app.include_router(auth.router)


def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def greet(db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    return db.query(database_models.User).all()

@app.get("/user/{email}")
def get_user_by_email(email: str, db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    user = db.query(database_models.User).filter(database_models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No user found with email: {email}"
        )
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "address": user.address
    }


@app.post("/product/")
def create_product(prodectBase: models.ProductBase, db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    new_product = database_models.Product(name=prodectBase.name, description=prodectBase.description, price=prodectBase.price, image=prodectBase.imageUrl)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.get("/getProduct")
def getProduct(db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    return db.query(database_models.Product).all()

@app.get("/getData")
def getData(db: Session = Depends(get_db)):
    return db.query(database_models.Product).all()

@app.post("/cart/add")
def add_to_cart(cart: models.CartBase, db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    total = cart.price * cart.quantity
    new_cart = database_models.Cart(
        user_id=cart.userId,
        product_id=cart.productId,
        product_name=cart.productName,
        price=cart.price,
        quantity=cart.quantity,
        total_price=total
    )
    db.add(new_cart)
    db.commit()
    db.refresh(new_cart)
    return new_cart

@app.get("/cart/{id}")
def get_cart(id: int, db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    products = db.query(database_models.Cart).filter(
        database_models.Cart.user_id == id
    ).filter(
        database_models.Cart.cart_status == "added"
    ).all()
    def to_cart_base(p):
        return models.CartBase(
            id= p.id,
            userId=p.user_id,
            productId=p.product_id,
            productName=p.product_name,
            price=p.price,
            quantity=p.quantity
        )

    return list(map(to_cart_base, products))


@app.post("/cart/checkout")
def checkout( carts: list[models.CartBase],  db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    added_items = []
    for cart in carts:
        total = cart.price * cart.quantity
        new_cart = database_models.Order(
            user_id=cart.userId,
            product_id=cart.productId,
            product_name=cart.productName,
            price=cart.price,
            quantity=cart.quantity,
            total_price=total
        )
        db.add(new_cart)
        added_items.append(new_cart)
        cart_item = db.query(database_models.Cart).filter(database_models.Cart.id == cart.id).first()
        if cart_item:
            cart_item.cart_status = "ordered"
        else:
            raise HTTPException(status_code=404, detail=f"Cart item with id {cart.id} not found")
    
    db.commit()

    for item in added_items:
        db.refresh(item)

    return added_items  


@app.get("/orders/{user_id}")
def get_user_orders(user_id: int, db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    orders = db.query(database_models.Order).filter(database_models.Order.user_id == user_id).all()
    if not orders:
        return []

    result = []
    for order in orders:
        product = db.query(database_models.Product).filter(database_models.Product.id == order.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {order.product_id} not found")

        order_data = models.OrderDetail(
            id=order.id,
            user_id=order.user_id,
            product_id=order.product_id,
            product_name=order.product_name,
            quantity=order.quantity,
            price=order.price,
            total_price=order.total_price,
            order_status=order.order_status,
            created_at=str(order.created_at)
        )

        product_data = models.ProductDetail(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            image=product.image
        )

        result.append(models.OrderWithProduct(order=order_data, product=product_data))
    
    return result


@app.get("/orders/pending/{userId}")
def getPendingOrders(userId: int, db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    orders_with_user = db.query(database_models.Order, database_models.User).join(
        database_models.User, database_models.User.id == database_models.Order.user_id
    ).filter(
        database_models.Order.order_status == "pending",
        or_(
            database_models.Order.rejected_by_user_id.is_(None),
            database_models.Order.rejected_by_user_id != userId
        )
    ).all()

    result = []
    for order, user in orders_with_user:
        result.append({
            "id": order.id,
            "product_name": order.product_name,
            "user_id": order.user_id,
            "user_name": user.name,
            "user_address": user.address,
            "quantity": order.quantity,
            "price": order.price,
            "total_price": order.total_price,
            "order_status": order.order_status,
            "accepted_by_user_id": order.accepted_by_user_id,
            "rejected_by_user_id": order.rejected_by_user_id,
            "created_at": order.created_at,
            "updated_at": order.updated_at
        })

    return result


@app.post("/orders/process/{order_id}/{userId}")
def process_order(
    order_id: int,
    userId: int,
    action: Literal["accept", "reject"],  # only accept or reject
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.verify_jwt)
):

    order = db.query(database_models.Order).filter(
        database_models.Order.id == order_id,
        database_models.Order.order_status == "pending"
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found or already processed")

    if action == "accept":
        order.order_status = "Order Placed"
        order.accepted_by_user_id = userId
    elif action == "reject":
        order.rejected_by_user_id = userId
    db.commit()
    db.refresh(order)

    return {"message": f"Order {action}ed successfully", "order_id": order.id}


@app.post("/orders/changestatus/{order_id}/{userId}/{status}")
def change_Order_status(
    order_id: int,
    userId: int,
    status: str,
    db: Session = Depends(get_db),
    payload: dict = Depends(auth.verify_jwt)
):
    order = db.query(database_models.Order).filter(
        database_models.Order.id == order_id,
        database_models.Order.accepted_by_user_id == userId
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found or already processed")

    order.order_status = status
    db.commit()
    db.refresh(order)

    return {"message": f"Order {status}ed successfully", "order_id": order.id}


@app.get("/orders/activeOrders/{userId}")
def getactiveOrders(userId: int, db: Session = Depends(get_db), payload: dict = Depends(auth.verify_jwt)):
    orders_with_user = db.query(database_models.Order, database_models.User).join(
        database_models.User, database_models.User.id == database_models.Order.user_id
    ).filter(database_models.Order.accepted_by_user_id == userId).all()

    result = []
    for order, user in orders_with_user:
        result.append({
            "id": order.id,
            "product_name": order.product_name,
            "user_id": order.user_id,
            "user_name": user.name,
            "user_address": user.address,
            "quantity": order.quantity,
            "price": order.price,
            "total_price": order.total_price,
            "order_status": order.order_status,
            "accepted_by_user_id": order.accepted_by_user_id,
            "rejected_by_user_id": order.rejected_by_user_id,
            "created_at": order.created_at,
            "updated_at": order.updated_at
        })

    return result


conf = ConnectionConfig(
    MAIL_USERNAME="sreehari.pattem@gmail.com",
    MAIL_PASSWORD="xcns ydkc wkqw adtd",
    MAIL_FROM="sreehari.pattem@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

class EmailSchema(BaseModel):
    email: EmailStr
    subject: str
    body: str


async def send_email(email: EmailSchema):
    message = MessageSchema(
        subject=email.subject,
        recipients=[email.email],
        body=email.body,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message) 
    return {"message": "Email sent successfully"}


from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler

async def check_orders_and_send_mail():
    """Runs every 10 minutes to check delayed orders and send emails."""
    db: Session = sessionLocal()
    now = datetime.now(timezone.utc)
    
    orders = db.query(database_models.Order).filter(
    database_models.Order.order_status != "Delivered",
    database_models.Order.is_mail_sent.is_(False)).all()

    for order in orders:
        time_gap = now - order.created_at
        time_gap_in_min = time_gap.total_seconds() / 60
 	user = db.query(database_models.User).filter(
        database_models.User.id == order.user_id).first()

        if time_gap_in_min > 10:
            email = EmailSchema(
            email= user.email,             subject="Delivery Delay Notification 🚚",
                body=f"""
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2 style="color: #FF5733;">Dear User,</h2>
                    <p>We apologize for the delay in delivering your product.</p>
                    
                    <h3>Order Details:</h3>
                    <ul>
                        <li><strong>Order ID:</strong> {order.id}</li>
                        <li><strong>Product:</strong> {order.product_name}</li>
                        <li><strong>Price:</strong> ₹{order.price}</li>
                        <li><strong>Quantity:</strong> {order.quantity}</li>
                        <li><strong>Ordered At:</strong> {order.created_at.strftime("%Y-%m-%d %H:%M:%S")}</li>
                    </ul>
                    <p>We’re working hard to get it delivered as soon as possible.</p>
                    <br/>
                    <p>Thank you for your patience,</p>
                </body>
                </html>
                """
        )
        await send_email(email)
        order.is_mail_sent = True
        db.commit()
        db.refresh(order)
    db.close()

import asyncio

def check_orders_and_send_mail_sync():
    asyncio.run(check_orders_and_send_mail())


scheduler = BackgroundScheduler()
scheduler.add_job(check_orders_and_send_mail_sync, "interval", minutes=10)
scheduler.start()

