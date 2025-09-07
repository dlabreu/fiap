// test_data_generator.js
// Este arquivo contém funções para gerar dados de teste para o SDK de antifraude.

// O script agora usa a variável de ambiente BACKEND_HOST.
// Isso permite que você aponte para o IP ou DNS do servidor de backend.
// Um fallback para localhost é usado para testes locais.
const BACKEND_HOST = process.env.BACKEND_HOST || "localhost";
const BACKEND_URL = `http://${BACKEND_HOST}:3000/api/fraud-check`;

/**
 * Coleta uma impressão digital de dispositivo genérica.
 * @returns {object} Dados de impressão digital do dispositivo.
 */
function getGenericDeviceFingerprint() {
    return {
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
        language: "pt-BR",
        platform: "Win32",
        timezone: "America/Sao_Paulo",
        screenResolution: "1920x1080",
        viewport: "1920x969",
        plugins: "PDF Viewer, Chrome PDF Viewer",
        hardwareConcurrency: 8,
        vendor: "Google Inc.",
    };
}

/**
 * Coleta dados de comportamento de usuário comum.
 * @returns {object} Dados comportamentais típicos.
 */
function getNormalBehaviorData() {
    return {
        timeOnPage: Math.floor(Math.random() * (60000 - 5000 + 1)) + 5000, // entre 5 e 60 segundos
        mouseMovementsCount: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
        mouseSpeed: (Math.random() * 50).toFixed(2),
        scrollPosition: { x: 0, y: Math.floor(Math.random() * 1000) },
        isTabFocused: true,
    };
}

/**
 * Coleta metadados de sessão genéricos.
 * @param {string} referrerUrl - URL de referência.
 * @returns {object} Metadados da sessão.
 */
function getGenericSessionMetadata(referrerUrl) {
    return {
        referrer: referrerUrl,
        url: "http://localhost:3000/checkout",
        timestamp: Date.now(),
    };
}

/**
 * Gera um payload de dados para um cenário de "baixo risco".
 * Simula um usuário legítimo com comportamento normal.
 * @returns {object} O payload completo para a requisição.
 */
function generateLowRiskPayload() {
    console.log("Gerando payload de BAIXO RISCO...");
    return {
        deviceFingerprint: getGenericDeviceFingerprint(),
        behaviorData: getNormalBehaviorData(),
        sessionMetadata: getGenericSessionMetadata(
            "http://localhost:3000/product/123",
        ),
    };
}

/**
 * Gera um payload de dados para um cenário de "alto risco".
 * Simula um bot ou uma tentativa de fraude.
 * @returns {object} O payload completo para a requisição.
 */
function generateHighRiskPayload() {
    console.log("Gerando payload de ALTO RISCO...");
    return {
        // User-Agent suspeito (headless bot)
        deviceFingerprint: {
            ...getGenericDeviceFingerprint(),
            userAgent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/117.0.0.0 Safari/537.36",
            platform: "MacIntel",
        },
        // Comportamento suspeito (tempo de página muito baixo)
        behaviorData: {
            ...getNormalBehaviorData(),
            timeOnPage: 100, // Tempo na página muito curto
            mouseMovementsCount: 5,
            mouseSpeed: 0.1,
        },
        sessionMetadata: getGenericSessionMetadata(
            "http://suspicious-site.com",
        ),
    };
}

/**
 * Testa a API com um payload de alto risco.
 */
async function testApi() {
    const highRiskData = generateHighRiskPayload();
    try {
        console.log(`Enviando dados para: ${BACKEND_URL}`);
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(highRiskData),
        });
        const result = await response.json();
        console.log("Resultado do teste de alto risco:", result);
    } catch (error) {
        console.error(
            "Ocorreu um erro ao tentar se conectar com o servidor. Verifique se o servidor de backend está rodando e acessível no endereço fornecido.",
        );
        console.error("Detalhes do erro:", error.message);
    }
}

testApi();
