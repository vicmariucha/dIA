from flask import Blueprint, request, jsonify
from services.usuario_service import (
    listar_usuarios,
    criar_usuario,
    buscar_usuario_por_id,
    deletar_usuario
)

usuario_bp = Blueprint("usuario_bp", __name__)

@usuario_bp.route("/usuarios", methods=["GET"])
def listar():
    try:
        usuarios = listar_usuarios()
        return jsonify(usuarios), 200
    except Exception as e:
        return jsonify({"error": "Erro ao listar usuários", "detalhes": str(e)}), 500

@usuario_bp.route("/usuarios", methods=["POST"])
def criar():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dados não fornecidos"}), 400
        doc_id = criar_usuario(data)
        return jsonify({"message": "Usuário criado com sucesso", "id": doc_id}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "Erro ao criar usuário", "detalhes": str(e)}), 500

@usuario_bp.route("/usuarios/<usuario_id>", methods=["GET"])
def buscar(usuario_id):
    try:
        usuario = buscar_usuario_por_id(usuario_id)
        if usuario:
            return jsonify(usuario), 200
        return jsonify({"error": "Usuário não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": "Erro ao buscar usuário", "detalhes": str(e)}), 500

@usuario_bp.route("/usuarios/<usuario_id>", methods=["DELETE"])
def deletar(usuario_id):
    try:
        if deletar_usuario(usuario_id):
            return jsonify({"message": "Usuário deletado com sucesso"}), 200
        return jsonify({"error": "Usuário não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": "Erro ao deletar usuário", "detalhes": str(e)}), 500
