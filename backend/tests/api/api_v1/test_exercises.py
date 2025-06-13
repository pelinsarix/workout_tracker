# Exercise endpoint tests
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.core.config import settings
from tests.utils.user import create_random_user

@ pytest.fixture(scope="function")
def user_token_headers(client: TestClient, db: Session) -> dict:
    """
    Fixture to create a test user and return auth headers.
    """
    user = create_random_user(db)
    login_data = {"username": user.email, "password": "testpassword"}
    r = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_exercise(client: TestClient, db: Session, user_token_headers: dict) -> None:
    """Test creating a new exercise."""
    data = {
        "nome": "Push Up",
        "grupo_muscular": "Peito",
        "equipamento": "Nenhum",
        "dificuldade": "medio",
        "publico": True
    }
    r = client.post(
        f"{settings.API_V1_STR}/exercicios/",
        json=data,
        headers=user_token_headers
    )
    assert r.status_code == 201
    result = r.json()
    assert result["nome"] == data["nome"]
    assert "id" in result


def test_list_exercises(client: TestClient, db: Session, user_token_headers: dict) -> None:
    """Test listing exercises."""
    # Ensure at least one exercise exists
    test_create_exercise(client, db, user_token_headers)
    r = client.get(
        f"{settings.API_V1_STR}/exercicios/",
        headers=user_token_headers
    )
    assert r.status_code == 200
    results = r.json()
    assert isinstance(results, list)
    assert len(results) >= 1


def test_get_exercise(client: TestClient, db: Session, user_token_headers: dict) -> None:
    """Test retrieving an exercise by id."""
    # Create a new exercise
    data = {
        "nome": "Squat",
        "grupo_muscular": "Perna",
        "equipamento": "Nenhum",
        "dificuldade": "medio",
        "publico": True
    }
    r = client.post(
        f"{settings.API_V1_STR}/exercicios/",
        json=data,
        headers=user_token_headers
    )
    ex_id = r.json()["id"]
    r2 = client.get(
        f"{settings.API_V1_STR}/exercicios/{ex_id}",
        headers=user_token_headers
    )
    assert r2.status_code == 200
    result = r2.json()
    assert result["id"] == ex_id
    assert result["nome"] == data["nome"]


def test_update_exercise(client: TestClient, db: Session, user_token_headers: dict) -> None:
    """Test updating an existing exercise."""
    # Create a new exercise
    data = {
        "nome": "Sit Up",
        "grupo_muscular": "Abdômen",
        "equipamento": "Nenhum",
        "dificuldade": "medio",
        "publico": False
    }
    r = client.post(
        f"{settings.API_V1_STR}/exercicios/",
        json=data,
        headers=user_token_headers
    )
    ex_id = r.json()["id"]
    update_data = {"nome": "Sit Up Modified"}
    r2 = client.put(
        f"{settings.API_V1_STR}/exercicios/{ex_id}",
        json=update_data,
        headers=user_token_headers
    )
    assert r2.status_code == 200
    assert r2.json()["nome"] == "Sit Up Modified"


def test_delete_exercise(client: TestClient, db: Session, user_token_headers: dict) -> None:
    """Test deleting an exercise and ensure it's gone."""
    # Create a new exercise
    data = {
        "nome": "Burpee",
        "grupo_muscular": "Corpo Inteiro",
        "equipamento": "Nenhum",
        "dificuldade": "dificil",
        "publico": True
    }
    r = client.post(
        f"{settings.API_V1_STR}/exercicios/",
        json=data,
        headers=user_token_headers
    )
    ex_id = r.json()["id"]
    # Delete
    r2 = client.delete(
        f"{settings.API_V1_STR}/exercicios/{ex_id}",
        headers=user_token_headers
    )
    assert r2.status_code == 200
    # Try to get deleted exercise
    r3 = client.get(
        f"{settings.API_V1_STR}/exercicios/{ex_id}",
        headers=user_token_headers
    )
    assert r3.status_code == 404
