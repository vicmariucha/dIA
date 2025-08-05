from couchdb_config import get_db

def criar_usuario(data):
    db = get_db()

    # Verifica se perfil é válido
    perfil = data.get("perfil")
    if perfil not in ["paciente", "profissional"]:
        raise ValueError("Perfil inválido. Deve ser 'paciente' ou 'profissional'.")

    # Monta documento base
    usuario = {
        "tipo": "usuario",
        "nome_completo": data.get("nome_completo"),
        "email": data.get("email"),
        "senha": data.get("senha"),
        "data_nascimento": data.get("data_nascimento"),
        "perfil": perfil
    }

    if perfil == "paciente":
        usuario["dados_paciente"] = {
            "tipo_diabetes": data.get("tipo_diabetes"),
            "data_diagnostico": data.get("data_diagnostico"),
            "tratamento": data.get("tratamento"),
            "frequencia_glicemia_dia": data.get("frequencia_glicemia_dia"),
            "hipoglicemia": data.get("hipoglicemia"),
            "hiperglicemia": data.get("hiperglicemia"),
            "usa_insulina": data.get("usa_insulina"),
            "tipo_insulina": data.get("tipo_insulina"),
            "frequencia_insulina": data.get("frequencia_insulina"),
            "insulinas_utilizadas": data.get("insulinas_utilizadas")
        }

    elif perfil == "profissional":
        usuario["dados_profissional"] = {
            "especialidade": data.get("especialidade"),
            "crm": data.get("crm"),
            "instituicao_formacao": data.get("instituicao_formacao")
        }

    doc_id, _ = db.save(usuario)
    return doc_id


def listar_usuarios():
    db = get_db()
    usuarios = []

    for doc_id in db:
        doc = db[doc_id]
        if doc.get("tipo") == "usuario":
            usuarios.append({"id": doc_id, **doc})
    
    return usuarios


def buscar_usuario_por_id(usuario_id):
    db = get_db()
    if usuario_id in db:
        doc = db[usuario_id]
        if doc.get("tipo") == "usuario":
            return {"id": usuario_id, **doc}
    return None


def deletar_usuario(usuario_id):
    db = get_db()
    if usuario_id in db:
        doc = db[usuario_id]
        if doc.get("tipo") == "usuario":
            db.delete(doc)
            return True
    return False
