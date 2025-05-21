# Pytest fixtures
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.main import app
from app.core.config import settings
from app.db.base import Base # Import Base from your app
from app.db.session import SessionLocal
from app.api import deps

# Use a different database for testing
SQLALCHEMY_DATABASE_URL_TEST = settings.SQLALCHEMY_DATABASE_URI + "_test"

engine = create_engine(SQLALCHEMY_DATABASE_URL_TEST)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in the test database
Base.metadata.drop_all(bind=engine) # Drop existing tables first
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="session")
def db() -> Generator:
    # Base.metadata.drop_all(bind=engine) # Ensure clean state
    # Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    yield db_session
    db_session.close()
    # Base.metadata.drop_all(bind=engine) # Clean up after tests

@pytest.fixture(scope="module")
def client(db: Session) -> Generator:
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[deps.get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    # Clean up dependency override after tests
    app.dependency_overrides = {}
