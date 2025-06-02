def analisar_requisicao(data):
    dispositivo = data.get("dispositivo", {})
    biometria = data.get("biometriaFacial", {})
    comportamento = data.get("comportamento", {})
    
    score_risco = 0
    motivos = []

    # Trust score baixo
    trust_score = dispositivo.get("trustScore", 50)
    if trust_score < 20:
        score_risco += 40
        motivos.append("TrustScore_baixo")
    elif trust_score < 50:
        score_risco += 20

    # Localização fora do país esperado
    if dispositivo.get("localizacao", {}).get("pais") != "BR":
        score_risco += 30
        motivos.append("Fora_do_BR")

    # Biometria não bateu
    if not biometria.get("match", False):
        score_risco += 20
        motivos.append("Biometria_falhou")

    # Padrão de comportamento estranho
    if comportamento.get("padraoMouse") in ["nenhum", "inconsistente"]:
        score_risco += 10
        motivos.append("Comportamento_irregular")

    # Resultado final
    if score_risco >= 80:
        categoria = "Bloquear"
        acao = "bloquear"
    elif score_risco >= 40:
        categoria = "Revisar"
        acao = "desafiar"
    else:
        categoria = "Seguro"
        acao = "permitir"

    return {
        "usuarioId": data.get("usuarioId"),
        "scoreRisco": score_risco,
        "categoria": categoria,
        "acaoRecomendada": acao,
        "motivos": motivos if motivos else None
    }

