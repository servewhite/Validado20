# Setup: Netlify Functions para Geração de PIX

## 🔴 Problema Identificado

O erro **"não estou conseguindo gerar o qrcold"** ocorre porque as **Netlify Functions** não estão configuradas. O frontend tenta chamar:

```
POST /.netlify/functions/create-payevo-transaction 404 (Not Found)
```

## ✅ Solução Implementada

### 1. Arquivos Criados

```
netlify/
├── functions/
│   ├── create-payevo-transaction.js  (Gera QR Code PIX)
│   └── verificarLoja.js              (Verifica horário de funcionamento)
├── toml.toml                          (Configuração Netlify)
├── .env.example                       (Variáveis de ambiente)
└── SETUP_FUNCTIONS.md                 (Este arquivo)
```

### 2. Como Fazer Deploy no Netlify

#### **Passo 1: Preparar Credenciais PayEvo**
1. Acesse https://payevo.com.br
2. Crie uma conta e gere suas credenciais:
   - `API_KEY` (chave de autenticação)
   - `MERCHANT_ID` (ID do comerciante)

#### **Passo 2: Configurar Variáveis de Ambiente**

**No Netlify Dashboard:**
1. Acesse seu site no Netlify
2. Vá para **Site Settings → Build & Deploy → Environment**
3. Clique em **Edit variables**
4. Adicione:
   - `PAYEVO_API_KEY` = Sua chave API
   - `PAYEVO_MERCHANT_ID` = Seu ID de comerciante

**Exemplo:**
```
PAYEVO_API_KEY: sk_live_abc123def456
PAYEVO_MERCHANT_ID: merch_9876543210
```

#### **Passo 3: Deploy**

**Via Git (Recomendado):**
```bash
git add netlify/ .env.example
git commit -m "feat: adicionar Netlify Functions para PIX"
git push
```

Netlify fará deploy automático!

**Via CLI Netlify:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 3. Testar as Functions

Após o deploy, teste em:

```
https://seu-site.netlify.app/.netlify/functions/verificarLoja
```

Você deve receber uma resposta como:
```json
{
  "success": true,
  "estaAberto": true,
  "horaAtual": "14:30",
  "mensagem": "🟢 Loja aberta. Você pode fazer seu pedido!"
}
```

### 4. Modo DEMO (Testes Rápidos)

Se as variáveis de ambiente **não estiverem configuradas**, a função funciona em **MODO DEMO**:
- ✅ Retorna QR code simulado
- ✅ Permite testar o fluxo completo
- ⚠️ QR code não é válido para pagamento real

**Para ativar MODO DEMO:**
Deixe `PAYEVO_API_KEY` e `PAYEVO_MERCHANT_ID` vazias

### 5. Fluxo de Funcionamento

```
Usuário clica "Gerar PIX"
        ↓
Frontend JS chama: /.netlify/functions/create-payevo-transaction
        ↓
Netlify Function recebe dados do cliente e carrinho
        ↓
Função valida dados
        ↓
Se credenciais configuradas: Chama API PayEvo
Se credenciais não configuradas: Retorna QR code DEMO
        ↓
Frontend recebe QR code
        ↓
Página exibe modal com QR code para pagamento
```

## 🛠️ Customizações

### Alterar Horários de Funcionamento

Em `netlify/functions/verificarLoja.js`, altere:

```javascript
const horariosFuncionamento = {
  0: null,                              // Domingo - Fechado
  1: { abre: 10 * 60, fecha: 22 * 60 }, // Segunda: 10:00 - 22:00
  2: { abre: 10 * 60, fecha: 22 * 60 }, // Terça
  // ... adicione seus horários
};
```

### Adicionar Novo Endpoint

1. Crie arquivo em `netlify/functions/novo-endpoint.js`
2. Exporte função `handler` async
3. Deploy automático!

## ⚠️ Troubleshooting

### Erro 404 na Function

**Causa:** Função não foi publicada
**Solução:** Verifique se os arquivos estão em `netlify/functions/`

### Erro de Autenticação PayEvo

**Causa:** `PAYEVO_API_KEY` ou `PAYEVO_MERCHANT_ID` incorretos
**Solução:** Verifique credenciais no Netlify Dashboard

### Timeout

**Causa:** API PayEvo demorando muito
**Solução:** Aumentar timeout em `.env` → `PAYEVO_TIMEOUT=60000`

### Modo DEMO sendo usado em produção

**Se vê:** `⚠️ MODO DEMO - Use credenciais reais em produção`
**Solução:** Configure variáveis de ambiente no Netlify

## 📚 Documentação

- [Netlify Functions](https://docs.netlify.com/functions/overview)
- [PayEvo API](https://payevo.com.br/docs)
- [Configurar Variáveis Netlify](https://docs.netlify.com/configuration-options/netlify-toml)

## 🎯 Próximos Passos

1. ✅ Obter credenciais PayEvo
2. ✅ Configurar variáveis no Netlify
3. ✅ Fazer deploy
4. ✅ Testar fluxo de pagamento
5. ✅ Monitorar logs em Netlify Dashboard → Functions

---

**Status:** ✅ Pronto para Deploy
**Última atualização:** Fevereiro 2026
