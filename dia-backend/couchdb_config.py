import couchdb

COUCHDB_USER = "Argoze"
COUCHDB_PASSWORD = "252829"
COUCHDB_URL = f"http://{COUCHDB_USER}:{COUCHDB_PASSWORD}@localhost:5984/"
DB_NAME = "usuarios"

def get_db():
    server = couchdb.Server(COUCHDB_URL)
    if DB_NAME in server:
        db = server[DB_NAME]
    else:
        db = server.create(DB_NAME)
    return db
