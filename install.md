# Manual de Instalação e Uso do SDK Antifraude without Containers

Este manual detalha como integrar o SDK de antifraude em sua aplicação web para coletar dados do usuário e analisar o risco de fraude.
O SDK é dividido em dois módulos: um para o **frontend** e outro para o **backend**.

---

## 1. Módulo do Lado do Backend (Servidor)

Este módulo é responsável por receber os dados do frontend, executar a análise de risco e retornar uma decisão.

### 1.1. Instalação e Configuração

Certifique-se de que você tem o **Node.js** instalado em seu ambiente.

Crie uma pasta para o seu serviço de backend e inicie o projeto:

```bash
mkdir fraud-service-backend
cd fraud-service-backend
npm init -y
```

Instale as dependências necessárias:

```bash
npm install express body-parser cors
```

Crie um arquivo chamado `index.js` com o código do serviço de análise de risco.

---

### 1.2. Integração na Aplicação

Em seu arquivo principal do servidor (por exemplo, `server.js` ou `app.js`), você precisa importar e usar o middleware do SDK para o endpoint de verificação:

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o CORS para permitir requisições do frontend
const fraudSDKBackend = require('./index'); // Seu arquivo com o código do SDK

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Use CORS para desenvolvimento e produção

// Integre o SDK como um middleware no seu endpoint de verificação
app.post('/api/fraud-check', (req, res) => {
    const riskData = req.body;
    const response = fraudSDKBackend.analyzeRisk(riskData);
    res.json(response);
});

app.listen(port, () => {
    console.log(`Servidor de análise de risco rodando em http://localhost:${port}`);
});
```

Seu backend agora está pronto para receber as requisições de verificação.

---

## 2. Módulo do Lado do Frontend (Cliente)

Este módulo é um arquivo JavaScript que pode ser incluído em qualquer aplicação web para coletar dados do usuário e enviá-los ao backend.

### 2.1. Instalação

Copie o código do `fraud_sdk_frontend.js` para um arquivo na sua pasta de assets (por exemplo, `public/js/fraud_sdk_frontend.js`).

Adicione-o ao seu HTML com uma tag `<script>` na seção `<body>` da sua página, idealmente antes de qualquer outro script que o utilize:

```html
<body>
    <!-- Seu HTML principal -->
    <script src="/js/fraud_sdk_frontend.js"></script>
    <script>
        // Seu código da aplicação
    </script>
</body>
```

Se você estiver usando um framework como **React**, **Vue** ou **Angular**, pode importar o arquivo diretamente em seu componente:

```js
import { FraudSDK } from './fraud_sdk_frontend.js';
```

---

### 2.2. Uso em Aplicações React

O exemplo a seguir mostra como usar o SDK em um componente de **login** ou **checkout** no React:

```jsx
import React, { useState } from 'react';
import { FraudSDK } from './fraud_sdk_frontend'; // Certifique-se de que o caminho está correto

function FraudCheckComponent() {
  const [fraudStatus, setFraudStatus] = useState('pending');

  const handleLogin = async () => {
    const fraudSDK = new FraudSDK('http://localhost:3000/api/fraud-check');

    try {
      const response = await fraudSDK.collectAndSend();

      if (response.status === 'deny') {
        setFraudStatus('denied');
        console.error('Acesso negado por alto risco de fraude.');
      } else if (response.status === 'review') {
        setFraudStatus('reviewing');
        console.warn('Seu acesso está sendo revisado. Você receberá um e-mail com instruções adicionais.');
      } else {
        setFraudStatus('allowed');
        console.log('Ação permitida. Prosseguindo.');
        // Implemente a lógica de login aqui
      }
    } catch (error) {
      console.error('Erro ao verificar o risco:', error);
      setFraudStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Clique no botão abaixo para simular o login e a verificação de fraude.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {fraudStatus === 'pending' && 'Simular Login'}
          {fraudStatus === 'reviewing' && 'Analisando...'}
          {fraudStatus === 'denied' && 'Acesso Negado'}
          {fraudStatus === 'allowed' && 'Login Permitido'}
          {fraudStatus === 'error' && 'Erro na Verificação'}
        </button>
      </div>
    </div>
  );
}

export default FraudCheckComponent;
```

---
