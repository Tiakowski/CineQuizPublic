
  // Seleciona o input do arquivo de imagem
  const avatarImage = document.querySelector('#avatar-image');
  
  // Seleciona o elemento h2 para exibição do título
  const h2Avatar = document.querySelector('#h2-avatar');
  
  // Seleciona o botão de limpar
  const removeButton = document.querySelector('#removeButton');
  
  // Seleciona o botão de upload
  const changeAvatar = document.querySelector('#changeAvatar');
  
  function crop(image){
    return new Cropper(image, {
      preview: "#preview-crop",
      aspectRatio: 1 / 1,
      viewMode: 1,
      dragMode: 'move',
    })
  }
  const viewportWidth = window.innerWidth * 0.8; // Define a largura desejada como uma porcentagem da largura da viewport
  const viewportHeight = window.innerHeight * 0.8; // Define a altura desejada como uma porcentagem da altura da viewport
  
  
  // Event listener para o evento "change" do input do arquivo de imagem
  avatarImage.addEventListener('change', event => {
    const preview = document.querySelector('#preview-image');
    const previewImage = document.createElement('img');
    previewImage.id = 'preview-image';
    previewImage.style.maxWidth = `${viewportWidth}px`;; // Defina a largura máxima desejada
    previewImage.style.maxHeight = `${viewportHeight}px`; // Defina a altura máxima desejada

    if (preview) {
      preview.remove();
    }

    const reader = new FileReader;

    reader.onload = function(event) {  
      previewImage.id = 'preview-image';
      previewImage.src = event.target.result;
      h2Avatar.insertAdjacentElement('afterend', previewImage);
    }

    reader.readAsDataURL(avatarImage.files[0]);

    setTimeout(() => {
      let cropper = crop(previewImage);
      let previewCrop = document.querySelector("#preview-crop");
      previewCrop.style = "overflow: hidden";

      removeButton.style = 'display: block'
      avatarImage.style = 'display: none'
      changeAvatar.style = 'display:block'

      removeButton.addEventListener('click', event => {
        cropper.destroy();
        previewImage.remove()
        changeAvatar.style = 'display:none'
        removeButton.style = 'display: none'
        avatarImage.value = ''
        avatarImage.style = 'display: block'
      })

      changeAvatar.addEventListener("click", event =>{
        if(cropper.cropped){
          cropper.getData({ rounded: true });
          cropper.getCroppedCanvas().toBlob(async blob =>{
            try {
              const file = new File([blob], 'profilepic.jpg');
              const formData = new FormData;
              formData.append('file', file);
              
              const response = await fetch("/api/user/changeprofilepic", {
                method: 'post',
                body: formData
              })

              location.reload();

            } catch (error) {
              console.log(error)
            }

          })
        }
  
      })

    },3)

    

  })