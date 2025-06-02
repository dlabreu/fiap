# Validador de Acesso com Análise de Risco

Este projeto é um exemplo de sistema de validação de requisições de login e checkout com base em dados comportamentais, localização, biometria e características do dispositivo. Ele utiliza Flask para fornecer uma API simples e uma interface web para testes.

## Funcionalidades

- API para validar requisições de acesso.
- Interface web para testar manualmente os dados.
- Análise de risco com base em múltiplos critérios.
- Container Podman para facilitar o deploy e testes.

---

## Requisitos

- [Podman](https://podman.io) instalado no seu sistema.
- Python 3 (se quiser rodar sem container).

---

## Instalação do Podman no Windows

1. Instale o [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/pt-br/windows/wsl/install).
2. Instale uma distribuição Linux (ex: Ubuntu) via Microsoft Store.
3. Dentro da distribuição Linux, execute:

```bash
sudo apt update
sudo apt install -y podman
```

4. (Opcional) Configure Podman para rodar como rootless com:

```bash
podman info
```

---

## Como Rodar

### 1. Clonar ou extrair os arquivos

Extraia o conteúdo do `.zip` ou clone o repositório se estiver no GitHub.

### 2. Build da imagem com Podman

```bash
podman build -t validador-acesso .
```

### 3. Executar o container

```bash
podman run --rm -p 8080:8080 validador-acesso
```

Acesse no navegador: [http://localhost:8080](http://localhost:8080)

---

## Estrutura do Projeto

- `app.py`: Servidor Flask que fornece a API e interface.
- `logic.py`: Contém a lógica de validação de risco.
- `templates/index.html`: Interface para testes manuais.
- `Containerfile`: Receita do container para rodar tudo automaticamente.

---

## Exemplo de Uso da API

```bash
curl -X POST http://localhost:8080/api/validar \
     -H "Content-Type: application/json" \
     -d '{ "usuarioId": "usr-123", "dispositivo": { "trustScore": 50 }, "biometriaFacial": { "match": false }, "comportamento": { "inputRate": 0.2, "padraoMouse": "nenhum" } }'
```

---

## Licença

Este projeto é apenas um protótipo para fins educacionais e de demonstração.

---
