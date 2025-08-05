from flask import Flask, request, jsonify
import couchdb

app = Flask(__name__)

# Conectando no banco CouchDB
couch = couchdb.Server("http://Argoze:252829@localhost:5984/")
db_name = 'usuarios'

# Criar banco se não existir
if db_name in couch:
    db = couch[db_name]
else:
    db = couch.create(db_name)

# Rota raiz
@app.route('/')
def home():
    return "API com CouchDB funcionando!"

# Criar novo usuário
@app.route('/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    doc_id, doc_rev = db.save(data)
    return jsonify({"message": "Usuário criado com sucesso", "id": doc_id}), 201

# Obter usuário por ID
@app.route('/usuarios/<id>', methods=['GET'])
def obter_usuario(id):
    user = db.get(id)
    if user:
        return jsonify(user)
    else:
        return jsonify({"erro": "Usuário não encontrado"}), 404

# Listar todos os usuários
@app.route('/usuarios', methods=['GET'])
def listar_usuarios():
    users = [db[id] for id in db]
    return jsonify(users)

# Atualizar usuário
@app.route('/usuarios/<id>', methods=['PUT'])
def atualizar_usuario(id):
    user = db.get(id)
    if user:
        novos_dados = request.get_json()
        user.update(novos_dados)
        db.save(user)
        return jsonify({"message": "Usuário atualizado com sucesso!"})
    else:
        return jsonify({"erro": "Usuário não encontrado"}), 404

# Deletar usuário
@app.route('/usuarios/<id>', methods=['DELETE'])
def deletar_usuario(id):
    user = db.get(id)
    if user:
        db.delete(user)
        return jsonify({"message": "Usuário deletado com sucesso!"})
    else:
        return jsonify({"erro": "Usuário não encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True)
