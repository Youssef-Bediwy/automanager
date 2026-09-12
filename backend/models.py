from sqlalchemy import Column, Integer, String
from database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    registration = Column(String, unique=True, nullable=False)
    year = Column(Integer, nullable=False)
    mileage = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
