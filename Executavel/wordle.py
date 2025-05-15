import webview
import random

class API:
    def __init__(self):
        self.palavras = [
            "gato", "pato", "livro", "solto", "certo", "plano", "mundo", "verde", "carta", "bicho",
            "navio", "pedra", "tempo", "pleno", "porta", "piano", "banho", "nuvem", "linha", "cinto",
            "peixe", "areia", "forca", "vinho", "folha", "papel", "treno", "couro", "banco", "grato",
            "risco", "barro", "baixo", "velho", "leito", "seixo", "anexo", "corte", "pente", "molho",
            "feira", "barco", "meche", "suave", "ponto", "nobre", "dente", "vento", "fundo", "beijo",
            "prato", "lente", "salto", "fraco", "corda", "letra", "ferro", "bolha", "amigo", "casal",
            "troca", "vazio", "tarde", "rapaz", "forma", "noite", "claro", "canto", "limpo", "cedro",
            "troco", "passe", "morro", "baixa", "cobre", "trago", "medir", "doido", "livre", "volta",
            "justo", "firme", "preto", "feita", "brisa", "sorte", "puxar", "forno", "tocar", "fruta",
            "fecho", "visto", "ganho", "trama", "bloco"
        ]
        self.palavra_secreta = self.sortear()

    def sortear(self):
        return random.choice(self.palavras).lower()

    def get_palavra_secreta(self):
        return self.palavra_secreta

    def reiniciar(self):
        self.palavra_secreta = self.sortear()
        return self.palavra_secreta

if __name__ == '__main__':
    api = API()
    webview.create_window(
        title="Advinhoca",
        url="index.html",
        js_api=api,
        resizable=False
    )
    webview.start()
