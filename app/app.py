from flask import Flask, request, jsonify, render_template
from logic import analisar_requisicao

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/validar', methods=['POST'])
def validar():
    if not request.is_json:
        return jsonify({"erro": "Requisição deve ser JSON"}), 400
    requisicao = request.get_json()
    resposta = analisar_requisicao(requisicao)
    return jsonify(resposta), 200

if __name__ == '__main__':
    print("Starting server on port 8080...")
    app.run(host='0.0.0.0', port=8080, debug=True)
