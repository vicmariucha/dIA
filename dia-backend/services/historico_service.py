# services/historico_service.py
from couchdb_config import get_db

# GLICEMIA
def salvar_glicemia(data):
    db = get_db()
    glicemia = {
        "tipo": "glicemia",
        "usuario_id": data.get("usuario_id"),
        "data": data.get("data"),
        "hora": data.get("hora"),
        "glicemia": data.get("glicemia"),
        "observacao": data.get("observacao")
    }
    doc_id, _ = db.save(glicemia)
    return doc_id

# INSULINA
def salvar_insulina(data):
    db = get_db()
    insulina = {
        "tipo": "insulina",
        "usuario_id": data.get("usuario_id"),
        "data": data.get("data"),
        "hora": data.get("hora"),
        "unidades": data.get("unidades"),
        "tipo_insulina": data.get("tipo_insulina")
    }
    doc_id, _ = db.save(insulina)
    return doc_id

# ATIVIDADE
def salvar_atividade(data):
    db = get_db()
    atividade = {
        "tipo": "atividade",
        "usuario_id": data.get("usuario_id"),
        "data": data.get("data"),
        "hora": data.get("hora"),
        "atividade": data.get("atividade"),
        "duracao_minutos": data.get("duracao_minutos")
    }
    doc_id, _ = db.save(atividade)
    return doc_id

# REFEICAO
def salvar_refeicao(data):
    db = get_db()
    refeicao = {
        "tipo": "refeicao",
        "usuario_id": data.get("usuario_id"),
        "data": data.get("data"),
        "hora": data.get("hora"),
        "carboidratos_g": data.get("carboidratos_g"),
        "tipo_refeicao": data.get("tipo_refeicao")
    }
    doc_id, _ = db.save(refeicao)
    return doc_id
