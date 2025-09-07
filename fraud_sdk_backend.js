// fraud_sdk_backend.js
// Este é um serviço backend leve em Node.js com ExpressJS para análise de risco.

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Necessário para permitir requisições do frontend

const app = express();
const port = 3000;

// Middleware para processar JSON e permitir CORS
app.use(bodyParser.json());
app.use(cors());

// Simulação de lista de IPs de alto risco.
// Em um sistema real, isso viria de um banco de dados ou serviço de terceiros.
const highRiskIPs = ["10.0.0.1", "192.168.1.1"];
const highRiskUserAgents = ["HeadlessChrome", "bot", "spider"];

/**
 * Endpoint para receber os dados do frontend e realizar a análise de risco.
 */
app.post("/api/fraud-check", (req, res) => {
    const { deviceFingerprint, behaviorData, sessionMetadata } = req.body;

    // Extrai o IP do usuário da requisição
    // Lembre-se que em produção, pode ser necessário verificar headers como 'X-Forwarded-For'
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    console.log("Dados recebidos para análise:", req.body);
    console.log("IP do cliente:", clientIp);

    // Lógica de análise de risco baseada em regras (simples)
    let riskScore = 0;
    let recommendation = "allow";

    // REGRA 1: Avaliação de IP de alto risco
    if (highRiskIPs.includes(clientIp)) {
        console.log("Regra 1 acionada: IP de alto risco detectado.");
        riskScore += 50;
    }

    // REGRA 2: Avaliação de User-Agent suspeito
    const isSuspiciousUserAgent = highRiskUserAgents.some((ua) =>
        deviceFingerprint.userAgent.toLowerCase().includes(ua.toLowerCase()),
    );
    if (isSuspiciousUserAgent) {
        console.log("Regra 2 acionada: User-Agent suspeito.");
        riskScore += 40;
    }

    // REGRA 3: Avaliação de comportamento atípico
    // Tempo de página muito curto (< 500ms) pode indicar um bot
    if (behaviorData.timeOnPage < 500) {
        console.log("Regra 3 acionada: Tempo na página muito baixo.");
        riskScore += 30;
    }

    // Pontuação final e determinação da resposta
    if (riskScore >= 80) {
        recommendation = "deny";
    } else if (riskScore >= 30) {
        recommendation = "review";
    }

    const responsePayload = {
        status: recommendation,
        score: riskScore,
        message: `Análise de risco concluída. Pontuação de risco: ${riskScore}.`,
        details: {
            ip_check: highRiskIPs.includes(clientIp) ? "Alto Risco" : "OK",
            user_agent_check: isSuspiciousUserAgent ? "Suspeito" : "OK",
            behavior_check: behaviorData.timeOnPage < 500 ? "Atípico" : "OK",
        },
    };

    console.log("Resposta enviada:", responsePayload);
    res.json(responsePayload);
});

// Inicia o servidor
app.listen(port, () => {
    console.log(
        `Servidor de análise de risco rodando em http://localhost:${port}`,
    );
    console.log("Aguardando requisições POST para /api/fraud-check");
});
