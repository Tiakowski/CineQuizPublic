document.addEventListener("DOMContentLoaded", function() {
    // Verificar se o consentimento de cookies não foi dado
    var cookieConsent = localStorage.getItem('cookieConsent');

    if (cookieConsent !== 'true') {
      // Abrir o modal
      var modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
      modal.show();
    }

    // Obter a referência ao botão "Aceitar"
  var acceptCookies = document.getElementById('acceptCookies');

  // Adicionar evento de clique ao botão
  acceptCookies.addEventListener('click', function() {
    // Definir o valor "true" no localStorage
    localStorage.setItem('cookieConsent', 'true');
    var modal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
    modal.hide();
  });

  });