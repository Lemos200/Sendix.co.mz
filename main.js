/* ===== CONFIGURAÇÃO (altere aqui) ===== */
// Número do WhatsApp com código do país, sem + nem espaços (Moçambique = 258)
var WHATSAPP = "258853539758";

(function () {

  /* ----- Menu no telemóvel ----- */
  var mb = document.querySelector(".menu-btn"), nav = document.getElementById("menu");
  if (mb && nav) {
    mb.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      mb.setAttribute("aria-expanded", aberto);
    });
  }

  /* ----- Links diretos para o WhatsApp ----- */
  document.querySelectorAll("[data-zap]").forEach(function (a) {
    a.href = "https://wa.me/" + WHATSAPP;
  });

  /* ----- Carrossel (qualquer elemento com data-carousel) ----- */
  document.querySelectorAll("[data-carousel]").forEach(function (c) {
    var itens = c.querySelectorAll(".item"),
        pontos = c.querySelector(".pontos"),
        tempo = parseInt(c.dataset.tempo, 10) || 5000,
        i = 0, timer, x0 = null;

    itens.forEach(function (_, n) {
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Slide " + (n + 1));
      d.addEventListener("click", function () { mostrar(n); });
      pontos.appendChild(d);
    });

    function mostrar(k) {
      i = (k + itens.length) % itens.length;
      itens.forEach(function (it, n) { it.classList.toggle("ativo", n === i); });
      Array.prototype.forEach.call(pontos.children, function (d, n) {
        d.setAttribute("aria-current", n === i);
      });
    }
    function parar() { clearInterval(timer); }
    function tocar() {
      parar();
      if (!matchMedia("(prefers-reduced-motion:reduce)").matches)
        timer = setInterval(function () { mostrar(i + 1); }, tempo);
    }

    c.querySelector(".seta-e").addEventListener("click", function () { mostrar(i - 1); });
    c.querySelector(".seta-d").addEventListener("click", function () { mostrar(i + 1); });
    c.addEventListener("mouseenter", parar);
    c.addEventListener("mouseleave", tocar);
    c.addEventListener("focusin", parar);
    c.addEventListener("focusout", tocar);

    // Deslizar com o dedo
    c.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; parar(); }, { passive: true });
    c.addEventListener("touchend", function (e) {
      if (x0 !== null) {
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) mostrar(dx < 0 ? i + 1 : i - 1);
      }
      x0 = null; tocar();
    });

    mostrar(0); tocar();
  });

  /* ----- Formulário de pedido -> WhatsApp ----- */
  var form = document.getElementById("f");
  if (form) {
    // Preenche o produto quando vem de um botão "Encomendar"
    var produto = new URLSearchParams(location.search).get("produto");
    if (produto) document.getElementById("prod").value = produto;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["nome", "tel", "prod", "qtd"].forEach(function (id) {
        var el = document.getElementById(id), vazio = !el.value.trim();
        el.classList.toggle("invalido", vazio);
        if (vazio) ok = false;
      });
      if (!ok) return;

      var v = function (id) { return document.getElementById(id).value.trim(); };
      var msg = "*Novo pedido*\n\n" +
        "Nome: " + v("nome") + "\n" +
        "Telefone: " + v("tel") + "\n" +
        "Pedido: " + v("prod") + "\n" +
        "Quantidade: " + v("qtd") + "\n" +
        "Recebimento: " + v("ent") + "\n" +
        "Endereço: " + (v("end") || "-") + "\n" +
        "Observações: " + (v("obs") || "-");

      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank");
    });
  }

})();