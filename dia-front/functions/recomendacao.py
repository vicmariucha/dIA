from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app) 

# Carregar o modelo treinado
try:
    modelo = joblib.load("modelo_dose_insulina.pkl")
    print("Modelo carregado com sucesso!")
except Exception as e:
    print(f"Erro ao carregar o modelo: {e}")
    exit(1)

# Parâmetros fixos para cálculo
ICR = 15  # Razão insulina-carboidrato
GLICEMIA_ALVO = 100  # Glicemia alvo (mg/dL)
FATOR_SENSIBILIDADE = 50  # Quanto 1U reduz na glicemia
LIMITE_MAXIMO = 15  # Limite máximo de unidades de insulina

# Função para pré-processar os dados e ajustar os cálculos
def calcular_dose(dados):
    glicemia_atual = dados["glicemia_atual"]
    carboidratos = dados["carboidratos"]
    tipo_dose = dados["tipo_dose"]
    atividade_fisica = dados["atividade_fisica"]

    # Cálculo da dose alimentar (bolus alimentar)
    bolus_alimentar = carboidratos / ICR if tipo_dose == "refeicao" else 0

    # Cálculo da dose de correção (bolus de correção)
    bolus_correcao = 0
    if glicemia_atual > GLICEMIA_ALVO:
        bolus_correcao = (glicemia_atual - GLICEMIA_ALVO) / FATOR_SENSIBILIDADE

    # Ajuste para atividade física
    if atividade_fisica in ["jaPraticou", "vaiPraticar"]:
        bolus_correcao *= 0.8

    # Soma total da dose e aplicação de limite
    dose_total = bolus_alimentar + bolus_correcao
    dose_total = min(dose_total, LIMITE_MAXIMO)

    # Regras adicionais para evitar hipoglicemia
    if glicemia_atual <= 120 and tipo_dose == "correcao":
        dose_total = 0

    return round(dose_total, 1)

@app.route("/recomendacao", methods=["POST"])
def recomendacao():
    try:
        # Verificar se os dados foram enviados na requisição
        dados = request.get_json()
        if not dados:
            return jsonify({"error": "Nenhum dado enviado."}), 400

        # Validar campos obrigatórios
        campos_necessarios = ["glicemia_atual", "tipo_dose", "carboidratos", "atividade_fisica"]
        for campo in campos_necessarios:
            if campo not in dados:
                return jsonify({"error": f"Campo obrigatório ausente: {campo}"}), 400

        # Calcular a dose recomendada
        dose = calcular_dose(dados)
        return jsonify({"dose_recomendada": dose})

    except Exception as e:
        # Log detalhado no terminal para depuração
        print(f"Erro inesperado: {e}")
        return jsonify({"error": "Erro interno no servidor."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
