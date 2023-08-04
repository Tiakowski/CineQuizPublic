# Quiz de Filmes

Este é um projeto de "Quiz de Filmes" com modos "infinito" e diário, onde os usuários podem testar seus conhecimentos sobre filmes e adivinhar os títulos corretos. O projeto também inclui um sistema de login/cadastro, perfis de usuários com a opção de trocar a foto de perfil e funcionalidade de seguir outros usuários. Além disso, possui um sistema de busca dinâmica usando Vue.js para buscar usuários e filmes.

## Tecnologias Utilizadas
- Node.js
- Express.js
- Multer
- Cropper.js
- JavaScript
- HTML
- CSS
- EJS
- Vue.js 
- Bootstrap
- JWT (Json Web Token)
- Bcrypt
- SQLite (anteriormente MySQL, mas transformado em SQLite posteriormente para deploy)
- Knex 

## Funcionalidades
- Modo "Infinito": Os usuários podem testar seus conhecimentos sobre filmes e responder a uma série de perguntas em um modo de Quiz "infinito".
- Modo Diário: Os usuários recebem um filme para adivinhar por dia e podem participar do desafio diário.
- Sistema de Login/Cadastro: Os usuários podem criar uma conta, fazer login e acessar o Quiz e outras funcionalidades personalizadas. A autenticação é realizada através do uso de JWT (Json Web Token) para maior segurança.
- Perfil do Usuário: Os usuários possuem perfis personalizados onde podem ver suas estatísticas no Quiz, suas conquistas e informações pessoais.
- Trocar Foto de Perfil: Os usuários podem fazer upload e trocar sua foto de perfil.
- Seguir e Ser Seguido: Os usuários podem seguir outros usuários e ver as atualizações dos perfis que seguem.
- Busca Dinâmica: O projeto possui um sistema de busca dinâmica utilizando Vue.js para buscar usuários e filmes de forma rápida e eficiente.
- Atualizações e Feedbacks: O projeto possui um sistema de atualizações dos filmes de forma fácil e intuitiva. Os administradores do sistema podem adicionar novos filmes e atualizar informações existentes de forma rápida e eficiente.
- Agendamento dos Filmes do Quiz Diário: O sistema conta com um agendamento automático dos filmes para o Quiz diário. Cada dia é atribuído um novo filme para que os usuários possam adivinhar. Isso garante uma experiência dinâmica e desafiadora para os participantes do Quiz diário.
- Dashboard para Gerenciar Feedbacks: O projeto possui um dashboard para lidar com os feedbacks dos usuários. Os administradores podem visualizar as sugestões e críticas dos usuários e tomar decisões informadas para melhorar o sistema e a experiência do usuário.

## Instalação e Execução
1. Clone o repositório:
`https://github.com/Tiakowski/CineQuizPublic`
2. Instale as dependências:
`npm install`
3. Inicie o servidor:
`node index.js` 

## Contato

Se você tiver alguma dúvida ou precisar de ajuda com este projeto, entre em contato através do email: tiagosantosrazr@gmail.com. adiciona essas coisas que eu fisse nas funcionalidades