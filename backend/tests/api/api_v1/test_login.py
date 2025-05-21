# Login endpoint tests
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from tests.utils.user import create_random_user

def test_get_access_token(
    client: TestClient, db: Session
) -> None:
    user = create_random_user(db)
    login_data = {
        "username": user.email,
        "password": "testpassword" # The password used in create_random_user
    }
    r = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    response_data = r.json()
    assert r.status_code == 200
    assert "access_token" in response_data
    assert response_data["access_token"]

def test_use_access_token(
    client: TestClient, db: Session
) -> None:
    user = create_random_user(db)
    login_data = {
        "username": user.email,
        "password": "testpassword"
    }
    r = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    response_data = r.json()
    token = response_data["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    r_user = client.get(f"{settings.API_V1_STR}/usuarios/me", headers=headers)
    assert r_user.status_code == 200
    current_user = r_user.json()
    assert current_user["email"] == user.email
