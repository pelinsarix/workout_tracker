import sys
import os

# Add project root to PYTHONPATH
# This ensures that 'app' can be imported by tests
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, PROJECT_ROOT)

# Pytest fixtures
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.main import app # This import should now work
from app.core.config import settings
from app.db.base import Base # Import Base from your app
# from app.db.session import SessionLocal # Not strictly needed if TestingSessionLocal is used for tests
from app.api import deps

# Use a different database for testing
# Ensure a unique name for the test database to avoid conflicts
# Using an in-memory SQLite database for tests is often faster if your tests don't rely on file persistence.
# SQLALCHEMY_DATABASE_URL_TEST = "sqlite:///:memory:"
# Or a file-based one if needed:
SQLALCHEMY_DATABASE_URL_TEST = "sqlite:///./test_fittracker.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL_TEST)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_engine():
    """
    Yields the SQLAlchemy engine for the test database.
    Drops and creates all tables once per test session.
    """
    Base.metadata.drop_all(bind=engine) # Ensure clean state before creating
    Base.metadata.create_all(bind=engine)
    yield engine # Yield engine for potential direct use, though db fixture is preferred for sessions
    # Base.metadata.drop_all(bind=engine) # Optional: clean up after all tests in session

@pytest.fixture(scope="function") # Changed from "session" to "function" for better test isolation
def db(db_engine) -> Generator[Session, None, None]: # db_engine is now a dependency
    """
    Yields a SQLAlchemy session for a test.
    Rolls back transactions after the test to ensure isolation.
    """
    connection = db_engine.connect()
    # begin a non-ORM transaction
    transaction = connection.begin()
    # bind an ORM session to the connection
    # The bind is important here for the session to use the correct transaction context
    db_session = TestingSessionLocal(bind=connection)

    yield db_session

    db_session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function") # Changed from "module" to "function"
def client(db: Session) -> Generator[TestClient, None, None]: # Added type hint for TestClient
    """
    Yields a TestClient for the FastAPI application.
    Overrides the 'get_db' dependency to use the test database session.
    """
    def override_get_db():
        try:
            yield db
        finally:
            # The 'db' fixture itself handles closing/rolling back the session.
            pass # Session is managed by the db fixture
    
    app.dependency_overrides[deps.get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    # Clean up dependency override after tests in this module
    app.dependency_overrides.pop(deps.get_db, None)
