from flask import Flask
from routes.usuario_routes import usuario_bp
from routes.historico_routes import historico_bp  # novo import

app = Flask(__name__)

# Registro das rotas
app.register_blueprint(usuario_bp)
app.register_blueprint(historico_bp)  # novo blueprint

if __name__ == "__main__":
    app.run(debug=True)
