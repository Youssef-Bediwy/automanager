from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)