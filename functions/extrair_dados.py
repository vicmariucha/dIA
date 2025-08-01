import sqlite3
import pandas as pd

# Nome do banco de dados e arquivo de saída
DATABASE_NAME = "dados_diabetes.db"
CSV_OUTPUT = "historico_diabetes.csv"

def exportar_historico_para_csv():
    try:
        # Conectar ao banco de dados
        conn = sqlite3.connect(DATABASE_NAME)
        print(f"Conectado ao banco de dados: {DATABASE_NAME}")

        # Consultar o histórico de dados
        query = """
        SELECT 
            glicemia, 
            carboidratos, 
            CASE tipo_insulina 
                WHEN 'Basal' THEN 0 
                ELSE 1 
            END AS tipo_dose,
            CASE atividade_fisica 
                WHEN 'naoPraticou' THEN 0 
                WHEN 'jaPraticou' THEN 1 
                ELSE 2 
            END AS atividade_fisica,
            dose_insulina AS dose_recomendada
        FROM historico
        """
        df = pd.read_sql_query(query, conn)

        # Validar se há dados retornados
        if df.empty:
            print("Nenhum dado encontrado no banco de dados.")
            return

        # Salvar os dados como CSV
        df.to_csv(CSV_OUTPUT, index=False)
        print(f"Dados exportados com sucesso para: {CSV_OUTPUT}")

    except sqlite3.Error as e:
        print(f"Erro ao acessar o banco de dados: {e}")

    except Exception as e:
        print(f"Erro inesperado: {e}")

    finally:
        # Fechar a conexão com o banco de dados
        if conn:
            conn.close()
            print("Conexão com o banco de dados encerrada.")

if __name__ == "__main__":
    exportar_historico_para_csv()
