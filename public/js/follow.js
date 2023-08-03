var buttons = document.getElementsByClassName('follow-btn');

for (var i = 0; i < buttons.length; i++) {
  var button = buttons[i];
  var username = button.getAttribute('data-username');

  button.addEventListener('click', function () {
    var clickedButton = this;
    $.ajax({
      url: '/api/user/follow/' + username,
      method: 'POST',
      success: function (response) {
        clickedButton.classList.toggle('btn-primary');
        clickedButton.classList.toggle('btn-success');
        clickedButton.textContent = clickedButton.classList.contains('btn-primary') ? 'Seguindo' : 'Seguir';
      },
      error: function (xhr, status, error) {
        console.log('Erro ao seguir usuário:', error);
      }
    });
  });
}
