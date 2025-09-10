# Instruções para Docker e Podman do SDK Antifraude

Este guia explica como **construir** e **rodar** os contêineres Docker ou Podman para o serviço de **backend** e o **gerador de dados de teste**.

---

## Estrutura do Projeto

Certifique-se de que seus arquivos estejam organizados da seguinte forma:

```text
.
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── fraud_sdk_backend.js
│
├── test/
│   ├── Dockerfile
│   ├── package.json
│   └── test_data_generator.js
│
└── README.md
```

---


## 1. Rodando o Serviço de Backend

O serviço de backend deve ser o primeiro a ser iniciado, pois o gerador de dados de teste precisa de um endpoint para enviar os dados.

### Passo a Passo

1) Navegue até o diretório `backend/` no seu terminal.
2) Construa a imagem do contêiner:

```bash
podman build -t fraud-sdk-backend .
```
ou

```bash
docker build -t fraud-sdk-backend .
```

3) Execute o conteiner `fraud-sdk-backend`:

```bash
podman run -d -p 3000:3000 --name fraud-backend-service fraud-sdk-backend
```
ou
```bash
docker run -d -p 3000:3000 --name fraud-backend-service fraud-sdk-backend
```

O servidor Express agora está rodando dentro do conteiner e a port 3000 esta servido o api.

---

## 2. Gerando e Enviando Dados de Teste

Agora você pode usar o contêiner do gerador de dados para enviar payloads para o backend que está rodando.

### Passo a Passo

1) Navegue até o diretório `test/` no seu terminal.
2) Construa a imagem do contêiner:

```bash
podman build -t test-data-generator .
```
ou
```bash
docker build -t test-data-generator .
```


3) Execute o conteiner, passando o endereço IP do seu servidor de backend como uma variável de ambiente. Substitua `<seu_ip_aqui>` pelo IP ou nome de domínio real da máquina onde o contêiner de backend está rodando:

```bash
podman run --rm -e BACKEND_HOST=<seu_ip_aqui> test-data-generator node test_data_generator.js
```
ou
```bash
docker run --rm -e BACKEND_HOST=<seu_ip_aqui> test-data-generator node test_data_generator.js
```

Ao executar o comando, o contêiner de teste irá rodar o script, enviar um payload de alto risco para o seu serviço de backend e mostrar o resultado no terminal.
