import couchdb
import os
from dotenv import load_dotenv

load_dotenv()  # Carrega as variáveis do .env

def get_db():
    user = os.getenv("COUCHDB_USER")
    password = os.getenv("COUCHDB_PASSWORD")
    host = os.getenv("COUCHDB_HOST", "localhost")
    port = os.getenv("COUCHDB_PORT", "5984")
    db_name = os.getenv("COUCHDB_DB", "dados_app")

    couch = couchdb.Server(f"http://{user}:{password}@{host}:{port}/")

    # Cria o banco se ele não existir
    if db_name not in couch:
        db = couch.create(db_name)
    else:
        db = couch[db_name]

    return db
