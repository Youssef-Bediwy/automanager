import os

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@localhost:5432/automanager_test",
)

from fastapi.testclient import TestClient

from database import Base, SessionLocal, engine
from main import app
from models import Vehicle

client = TestClient(app)


def setup_function():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        db.query(Vehicle).delete()
        db.commit()
    finally:
        db.close()


def sample_vehicle():
    return {
        "brand": "Renault",
        "model": "Clio V",
        "registration": "TEST-001",
        "year": 2022,
        "mileage": 25000,
        "status": "available",
        "image_url": "https://example.com/clio.jpg",
    }


def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AutoManager API fonctionne"}


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_vehicle():
    response = client.post("/vehicles", json=sample_vehicle())
    assert response.status_code == 200
    data = response.json()
    assert data["id"] is not None
    assert data["brand"] == "Renault"
    assert data["registration"] == "TEST-001"
    assert data["image_url"] == "https://example.com/clio.jpg"


def test_get_vehicles():
    client.post("/vehicles", json=sample_vehicle())
    response = client.get("/vehicles")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["registration"] == "TEST-001"


def test_get_vehicle_by_id():
    created = client.post("/vehicles", json=sample_vehicle()).json()
    response = client.get(f"/vehicles/{created['id']}")
    assert response.status_code == 200
    assert response.json()["brand"] == "Renault"


def test_update_vehicle():
    created = client.post("/vehicles", json=sample_vehicle()).json()

    updated_vehicle = {
        "brand": "Renault",
        "model": "Clio V",
        "registration": "TEST-001",
        "year": 2022,
        "mileage": 30000,
        "status": "rented",
        "image_url": "https://example.com/clio-new.jpg",
    }

    response = client.put(f"/vehicles/{created['id']}", json=updated_vehicle)
    assert response.status_code == 200

    data = response.json()
    assert data["mileage"] == 30000
    assert data["status"] == "rented"
    assert data["image_url"] == "https://example.com/clio-new.jpg"


def test_delete_vehicle():
    created = client.post("/vehicles", json=sample_vehicle()).json()
    response = client.delete(f"/vehicles/{created['id']}")

    assert response.status_code == 200
    assert response.json() == {"message": "Vehicle deleted successfully"}

    response_after_delete = client.get(f"/vehicles/{created['id']}")
    assert response_after_delete.status_code == 404


def test_vehicle_not_found():
    response = client.get("/vehicles/999999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Vehicle not found"}
