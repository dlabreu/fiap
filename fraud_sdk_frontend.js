// fraud_sdk_frontend.js
// Este módulo é um SDK agnóstico de framework, para ser usado em qualquer aplicação web.

class FraudSDK {
  /**
   * Construtor da classe FraudSDK.
   * @param {string} endpointUrl - A URL do endpoint do backend para envio dos dados.
   */
  constructor(endpointUrl) {
    if (!endpointUrl) {
      console.error('FraudSDK: A URL do endpoint do backend é obrigatória.');
      return;
    }
    this.endpointUrl = endpointUrl;
    this.mouseMovements = [];
    this.initialTime = Date.now();
    this.addEventListeners();
  }

  /**
   * Adiciona event listeners para capturar o comportamento do usuário.
   * Esta é uma implementação básica. Para um SDK de produção, seria necessário
   * uma abordagem mais robusta e otimizada para evitar sobrecarga.
   */
  addEventListeners() {
    // Captura os movimentos do mouse
    document.addEventListener('mousemove', (event) => {
      this.mouseMovements.push({ x: event.clientX, y: event.clientY, t: Date.now() });
    });

    // Captura o foco da aba
    window.addEventListener('blur', () => {
      this.isTabFocused = false;
    });

    window.addEventListener('focus', () => {
      this.isTabFocused = true;
    });

    this.isTabFocused = document.hasFocus();
  }

  /**
   * Coleta dados de comportamento do usuário.
   * @returns {object} Dados comportamentais.
   */
  getBehaviorData() {
    const timeOnPage = Date.now() - this.initialTime;
    const scrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
    };
    
    // Análise básica da velocidade do mouse
    const movementCount = this.mouseMovements.length;
    const mouseSpeed = movementCount > 0 ? (this.mouseMovements[movementCount - 1].t - this.mouseMovements[0].t) / movementCount : 0;

    return {
      timeOnPage,
      mouseMovementsCount: movementCount,
      mouseSpeed: mouseSpeed.toFixed(2),
      scrollPosition,
      isTabFocused: this.isTabFocused,
    };
  }

  /**
   * Coleta dados de device fingerprint.
   * @returns {object} Dados de impressão digital do dispositivo.
   */
  getDeviceFingerprint() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      plugins: Array.from(navigator.plugins).map(p => p.name).join(', '),
      hardwareConcurrency: navigator.hardwareConcurrency,
      vendor: navigator.vendor,
    };
  }

  /**
   * Coleta metadados da sessão.
   * @returns {object} Metadados da sessão.
   */
  getSessionMetadata() {
    return {
      referrer: document.referrer,
      url: window.location.href,
      timestamp: Date.now(),
    };
  }

  /**
   * Coleta todos os dados e os envia para o backend.
   * @returns {Promise<object>} A resposta da API do backend.
   */
  async collectAndSend() {
    const payload = {
      deviceFingerprint: this.getDeviceFingerprint(),
      behaviorData: this.getBehaviorData(),
      sessionMetadata: this.getSessionMetadata(),
    };

    try {
      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta do servidor: ${response.status}`);
      }

      const result = await response.json();
      console.log('Análise de risco recebida:', result);
      return result;

    } catch (error) {
      console.error('Erro ao enviar dados para o backend:', error);
      return { status: 'review', error: 'Falha na comunicação com o SDK de fraude.' };
    }
  }
}

// Exemplo de uso
// const fraudSdk = new FraudSDK('http://localhost:3000/api/fraud-check');
// fraudSdk.collectAndSend().then(response => {
//   if (response.status === 'deny') {
//     console.log('Ação bloqueada por alto risco!');
//     // Lógica de negação aqui...
//   }
// });

