const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'DAO/db.db', // Substitua pelo caminho do arquivo do banco de dados SQLite
  },
  useNullAsDefault: true, // Define valores padrão NULL para colunas quando não especificado
});

module.exports = knex;