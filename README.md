# Funcionalidades do Back-End

## Autenticação e Autorização
- [ X ] **Registro de Usuário**: Endpoint para criação de novos usuários. Inclui validação de dados de entrada como e-mail e senha.
- [ X ] **Login de Usuário**: Endpoint para autenticação de usuários, gerando e gerenciando tokens JWT para sessões.
- [ X ] **Recuperação de Senha**: Endpoint para solicitação de redefinição de senha.
- [ X ] **Autorização**: Middleware para verificar permissões de acesso em rotas protegidas.

## Gestão de Produtos
- [ X ] **CRUD de Produtos**: Endpoints para criação, leitura, atualização e exclusão de produtos, incluindo validação de dados.
- [ X ] **Categorias de Produtos**: Endpoints para gerenciamento de categorias (criação, leitura, atualização, exclusão).
- [ ] **Busca e Filtros de Produtos**: Endpoint para busca de produtos com filtros por categoria, preço, popularidade, etc.

## Carrinho de Compras
- [ ] **Gerenciamento de Carrinho**: Endpoints para adicionar, atualizar e remover itens do carrinho, com cálculo dinâmico do total.

## Pedido e Checkout
- [ ] **Processamento de Pedidos**: Endpoint para criação de novos pedidos, validando dados de entrega e pagamento.
- [ ] **Gerenciamento de Pedidos**: Endpoints para visualizar o histórico de pedidos do usuário e atualizar o status do pedido (pendente, enviado, entregue).

## Pagamento
- [ ] **Integração de Pagamentos**: Endpoint para processar pagamentos através de gateways como Stripe e PayPal, com validação de transações e geração de comprovantes.

## Usuário
- [ ] **Perfil de Usuário**: Endpoints para atualização de informações do perfil do usuário e visualização do histórico de pedidos e endereços salvos.

## Administração
- [ ] **Painel Administrativo**: Endpoints para visualização e gerenciamento de produtos, pedidos e usuários, incluindo relatórios de vendas e estoque.

## Notificação
- [ ] **Notificações por E-mail**: Envio de e-mails de confirmação de pedido, atualização de status e recuperação de senha.
- [ ] **Notificações em Tempo Real**: Implementação de WebSockets para notificações em tempo real (status do pedido, mensagens do suporte).
