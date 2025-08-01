import sqlite3
import pandas as pd
import random

# Nome do banco de dados
DATABASE_NAME = "dados_diabetes.db"

def criar_e_popular_banco():
    try:
        # Conectar ao banco de dados
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        print(f"Conectado ao banco de dados: {DATABASE_NAME}")

        # Recriar tabela com as colunas corretas
        cursor.execute("DROP TABLE IF EXISTS historico")  # Excluir tabela antiga, se existir
        cursor.execute("""
        CREATE TABLE historico (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            glicemia INTEGER NOT NULL,
            carboidratos INTEGER NOT NULL,
            tipo_insulina TEXT NOT NULL,
            atividade_fisica TEXT NOT NULL,
            dose_insulina REAL NOT NULL,
            data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        print("Tabela 'historico' recriada com sucesso.")

        # Popular com dados fictícios
        atividades = ["naoPraticou", "jaPraticou", "vaiPraticar"]
        tipos_insulina = ["Basal", "Rápida"]

        novos_dados = [
            (
                random.randint(50, 400),  # glicemia
                random.randint(0, 150),  # carboidratos
                random.choice(tipos_insulina),  # tipo_insulina
                random.choice(atividades),  # atividade_fisica
                round(random.uniform(0.5, 15), 1)  # dose_insulina
            )
            for _ in range(50)
        ]

        cursor.executemany("""
        INSERT INTO historico (glicemia, carboidratos, tipo_insulina, atividade_fisica, dose_insulina)
        VALUES (?, ?, ?, ?, ?)
        """, novos_dados)

        print(f"{len(novos_dados)} registros adicionados à tabela 'historico'.")

        # Salvar alterações
        conn.commit()

    except sqlite3.Error as e:
        print(f"Erro ao acessar o banco de dados: {e}")

    except Exception as e:
        print(f"Erro inesperado: {e}")

    finally:
        # Fechar a conexão
        if conn:
            conn.close()
            print("Conexão com o banco de dados encerrada.")

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
        csv_output = "historico_diabetes.csv"
        df.to_csv(csv_output, index=False)
        print(f"Dados exportados com sucesso para: {csv_output}")

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
    criar_e_popular_banco()
    exportar_historico_para_csv()
