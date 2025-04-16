from uuid import uuid4

import databases
import sqlalchemy
from sqlalchemy import (
    JSON,
    TIMESTAMP,
    UUID,
    Boolean,
    Column,
    Enum,
    MetaData,
    String,
    Table,
    Text,
    text,
)

from app.core.config import settings

metadata = MetaData()

users_table = Table(
    "users",
    metadata,
    Column("id", UUID, primary_key=True, default=uuid4),
    Column("email", String, unique=True, nullable=False),
    Column("password", String, nullable=False),
    Column("confirmed", Boolean, default=False),
)

messages_table = Table(
    "messages",
    metadata,
    Column("id", UUID, primary_key=True, default=uuid4),
    Column("content", Text, nullable=False),
    Column(
        "role", Enum("user", "assistant", "system", name="role_type"), nullable=False
    ),
    Column("client_id", String, nullable=False, index=True),
    Column(
        "created_at",
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
    ),
    Column("metadata", JSON),  # For storing sql_query and data
)


connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
engine = sqlalchemy.create_engine(settings.DATABASE_URL)

metadata.drop_all(engine)
metadata.create_all(engine)

db_args = {"min_size": 1, "max_size": 4} if "postgres" in settings.DATABASE_URL else {}
database = databases.Database(
    settings.DATABASE_URL, force_rollback=settings.DB_FORCE_ROLL_BACK, **db_args
)
