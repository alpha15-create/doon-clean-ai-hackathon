import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database.database import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    init_db()
    yield

@pytest.fixture
def client():
    return TestClient(app)
