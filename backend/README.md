# Projeto de API para Gerenciamento de Treinos

Este projeto é uma API desenvolvida para gerenciar treinos, exercícios e usuários. A estrutura do projeto é organizada em pacotes que facilitam a manutenção e a escalabilidade da aplicação.

## Estrutura do Projeto

- **app/**: Contém o código principal da aplicação.
  - **api/**: Define os endpoints da API.
  - **core/**: Contém configurações e funcionalidades centrais.
  - **db/**: Relacionado ao banco de dados.
  - **models/**: Modelos SQLAlchemy.
  - **schemas/**: Esquemas Pydantic para validação.
  - **crud/**: Operações CRUD.
  - **utils/**: Utilitários.

## Como Executar

1. Clone o repositório.
2. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
3. Configure as variáveis de ambiente no arquivo `.env`.
4. Execute a aplicação:
   ```
   python main.py
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.