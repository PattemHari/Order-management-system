from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
db_url = "postgresql://postgres:hari@localhost:5432/order_management"
engine = create_engine(db_url)
sessionLocal  = sessionmaker(autocommit = False, autoflush=False, bind=engine)