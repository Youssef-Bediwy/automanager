from pydantic import BaseModel


class VehicleCreate(BaseModel):
    brand: str
    model: str
    registration: str
    year: int
    mileage: int
    status: str
    image_url: str | None = None


class VehicleResponse(VehicleCreate):
    id: int

    class Config:
        from_attributes = True
