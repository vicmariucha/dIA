from flask import Blueprint, request, jsonify
from services.historico_service import (
    salvar_glicemia,
    salvar_insulina,
    salvar_atividade,
    salvar_refeicao
)

historico_bp = Blueprint("historico_bp", __name__)

@historico_bp.route("/historico/glicemia", methods=["POST"])
def adicionar_glicemia():
    try:
        data = request.get_json()
        doc_id = salvar_glicemia(data)
        return jsonify({"message": "Registro de glicemia salvo com sucesso", "id": doc_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@historico_bp.route("/historico/insulina", methods=["POST"])
def adicionar_insulina():
    try:
        data = request.get_json()
        doc_id = salvar_insulina(data)
        return jsonify({"message": "Registro de insulina salvo com sucesso", "id": doc_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@historico_bp.route("/historico/atividade", methods=["POST"])
def adicionar_atividade():
    try:
        data = request.get_json()
        doc_id = salvar_atividade(data)
        return jsonify({"message": "Registro de atividade salvo com sucesso", "id": doc_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@historico_bp.route("/historico/refeicao", methods=["POST"])
def adicionar_refeicao():
    try:
        data = request.get_json()
        doc_id = salvar_refeicao(data)
        return jsonify({"message": "Registro de refeição salvo com sucesso", "id": doc_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
