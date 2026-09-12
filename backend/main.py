from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
from models import Vehicle
from schemas import VehicleCreate, VehicleResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AutoManager API",
    description="API de gestion des véhicules de MecaDrive",
    version="1.1.0"
)

origins = [
    "http://localhost:3000",
    "https://automanager-q84xx7t6x-youss-team.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

with engine.begin() as connection:
    connection.execute(
        text("ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS image_url VARCHAR")
    )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "AutoManager API fonctionne"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/vehicles", response_model=VehicleResponse)
def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db)
):
    new_vehicle = Vehicle(
        brand=vehicle.brand,
        model=vehicle.model,
        registration=vehicle.registration,
        year=vehicle.year,
        mileage=vehicle.mileage,
        status=vehicle.status,
        image_url=vehicle.image_url
    )

    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)

    return new_vehicle


@app.get("/vehicles", response_model=list[VehicleResponse])
def get_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()


@app.get("/vehicles/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return vehicle


@app.put("/vehicles/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    vehicle.brand = vehicle_data.brand
    vehicle.model = vehicle_data.model
    vehicle.registration = vehicle_data.registration
    vehicle.year = vehicle_data.year
    vehicle.mileage = vehicle_data.mileage
    vehicle.status = vehicle_data.status
    vehicle.image_url = vehicle_data.image_url

    db.commit()
    db.refresh(vehicle)

    return vehicle


@app.delete("/vehicles/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()

    return {"message": "Vehicle deleted successfully"}
