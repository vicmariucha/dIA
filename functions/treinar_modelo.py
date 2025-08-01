import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from sklearn.preprocessing import StandardScaler

# Criar dados fictícios mais realistas
np.random.seed(42)  # Garantir reprodutibilidade

# Dados simulados baseados em regras realistas
glicemia_base = np.random.randint(80, 400, 1000)  # Glicemias entre normal e muito alta
carboidratos_base = np.random.randint(0, 150, 1000)  # Quantidade de carboidratos ingeridos
tipo_dose_base = np.random.choice([0, 1], size=1000)  # 0 = correção, 1 = refeição
atividade_fisica_base = np.random.choice([0, 1, 2], size=1000)  # 0 = não praticou, 1 = já praticou, 2 = vai praticar

# Regras simuladas para dose
dose_insulina = (
    (glicemia_base - 100) * 0.1  # Correção para glicemias acima de 100
    + (carboidratos_base / 10) * tipo_dose_base  # Dose para refeição baseada em carboidratos
    - (atividade_fisica_base * 1)  # Redução de dose por atividade física
)
dose_insulina = np.clip(dose_insulina, 0.5, 15)  # Limitar as doses entre 0.5 e 15

dados = pd.DataFrame({
    "glicemia_atual": glicemia_base,
    "carboidratos": carboidratos_base,
    "tipo_dose": tipo_dose_base,
    "atividade_fisica": atividade_fisica_base,
    "dose_insulina": dose_insulina,
})

# Separar as variáveis independentes e a dependente
X = dados[["glicemia_atual", "carboidratos", "tipo_dose", "atividade_fisica"]]
y = dados["dose_insulina"]

# Normalizar os dados
scaler = StandardScaler()
X_normalizado = scaler.fit_transform(X)

# Dividir os dados em treino e teste
X_treino, X_teste, y_treino, y_teste = train_test_split(X_normalizado, y, test_size=0.2, random_state=42)

# Treinar o modelo Random Forest
modelo = RandomForestRegressor(n_estimators=200, max_depth=20, random_state=42)
modelo.fit(X_treino, y_treino)

# Avaliar o modelo
y_pred = modelo.predict(X_teste)

# Calcular o erro quadrático médio raiz (RMSE)
rmse = np.sqrt(mean_squared_error(y_teste, y_pred))  # Calcular raiz manualmente
r2 = r2_score(y_teste, y_pred)  # Coeficiente de determinação

print(f"Erro quadrático médio (RMSE): {rmse:.2f}")
print(f"Coeficiente de determinação (R²): {r2:.2f}")

# Salvar o modelo treinado
modelo_path = "modelo_dose_insulina.pkl"
joblib.dump(modelo, modelo_path)
print(f"Modelo salvo como '{modelo_path}'")

# Salvar o scaler para normalização
scaler_path = "scaler.pkl"
joblib.dump(scaler, scaler_path)
print(f"Scaler salvo como '{scaler_path}'")
