Instruções para Docker e Podman do SDK Antifraude
Este guia explica como construir e rodar os contêineres Docker ou Podman para o serviço de backend e o gerador de dados de teste.

Estrutura do Projeto
Certifique-se de que seus arquivos estejam organizados da seguinte forma:

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

1. Configurando a Rede Compartilhada (Podman)
Para que os contêineres possam se comunicar, eles devem estar na mesma rede. Crie uma nova rede do Podman.

podman network create --ignore fraud-network



2. Rodando o Serviço de Backend
O serviço de backend deve ser o primeiro a ser iniciado, pois o gerador de dados de teste precisa de um endpoint para enviar os dados.

Passo a Passo:

Navegue até o diretório backend/ no seu terminal.

Construa a imagem do contêiner.

podman build -t fraud-sdk-backend .



Execute o contêiner e conecte-o à rede fraud-network.

podman run --name fraud-backend-service --network=fraud-network -d fraud-sdk-backend



O servidor Express agora está rodando dentro do contêiner na rede fraud-network.

3. Gerando e Enviando Dados de Teste
Agora você pode usar o contêiner do gerador de dados para enviar payloads para o backend que está rodando.

Passo a Passo:

Navegue até o diretório test/ no seu terminal.

Construa a imagem do contêiner.

podman build -t test-data-generator .



Execute o contêiner, passando o endereço IP do seu servidor de backend como uma variável de ambiente. Substitua <seu_ip_aqui> pelo IP ou nome de domínio real da máquina onde o contêiner de backend está rodando.

podman run --rm -e BACKEND_HOST=<seu_ip_aqui> test-data-generator node test_data_generator.js



Ao executar o comando, o contêiner de teste irá rodar o script, enviar um payload de alto risco para o seu serviço de backend e mostrar o resultado no terminal.
