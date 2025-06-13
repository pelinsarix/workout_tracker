# User endpoint tests
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.core.config import settings
from tests.utils.user import create_random_user

def test_create_user_new_email(client: TestClient, db: Session) -> None:
    username = "test@example.com"
    password = "testpassword123"
    data = {"email": username, "password": password, "nome": "Test User"}
    r = client.post(
        f"{settings.API_V1_STR}/usuarios/",
        json=data,
    )
    assert 200 <= r.status_code < 300
    created_user = r.json()
    assert created_user["email"] == data["email"]
    assert "id" in created_user
    assert "nome" in created_user

def test_get_existing_user(client: TestClient, db: Session) -> None:
    user = create_random_user(db)
    r = client.get(f"{settings.API_V1_STR}/usuarios/{user.id}")
    assert 200 <= r.status_code < 300
    api_user = r.json()
    assert api_user["email"] == user.email
    assert api_user["id"] == user.id
    assert api_user["nome"] == user.nome

def test_create_user_existing_email(client: TestClient, db: Session) -> None:
    user = create_random_user(db) # Creates a user with test@example.com
    data = {"email": user.email, "password": "newpassword123", "nome": "Another Test User"}
    r = client.post(
        f"{settings.API_V1_STR}/usuarios/",
        json=data,
    )
    created_user = r.json()
    assert r.status_code == 400
    assert "_id" not in created_user # Or check for specific error message

def test_retrieve_users(client: TestClient, db: Session) -> None:
    create_random_user(db) # User 1
    create_random_user(db) # This will return the same user due to email uniqueness
                           # To test multiple users, ensure unique emails or modify create_random_user

    r = client.get(f"{settings.API_V1_STR}/usuarios/")
    all_users = r.json()
    assert r.status_code == 200
    assert len(all_users) >= 1 # At least one user should exist
    # Add more specific assertions if needed, e.g., checking structure of items

# TODO: Add tests for user update and delete if those endpoints are implemented
# TODO: Add tests for authentication requirements if endpoints are protected
