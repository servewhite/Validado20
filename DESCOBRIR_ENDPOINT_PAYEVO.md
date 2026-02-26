# 🔍 Descobrindo o Endpoint Correto da PayEvo

## ❌ O Problema

Você está recebendo o erro:
```
404 - requested path is invalid
```

Isso significa que o endpoint `/pix/generate` **está errado** para sua conta PayEvo.

---

## ✅ Soluções

### Solução 1: Verificar na Dashboard PayEvo (RECOMENDADO)

1. Acesse: https://app.payevo.com.br
2. Vá para: **Configurações → Integrações → API / Webhooks**
3. Procure pela seção de documentação ou "Endpoints"
4. Anote o endpoint correto, deve ser algo como:
   - `/transactions`
   - `/pix`
   - `/pix/create`
   - `/v1/transactions`
   - `/v2/pix/generate`
   - etc.

### Solução 2: Consultar Suporte PayEvo

Se não encontrar, abra um chamado com a PayEvo:
- **Pergunta**: "Qual é o endpoint correto para gerar PIX? (método POST)"
- **Resposta esperada**: Algo como `/transactions` ou `/pix/generate`
- **Link**: https://suporte.payevo.com.br

---

## 🔧 Como Configurar no Netlify

Após descobrir o endpoint correto:

1. Acesse **Netlify → Site settings → Environment**
2. **Adicione/Altere** estas variáveis:

```
PAYEVO_API_HOST = api.payevo.com.br
PAYEVO_API_PATH = /transactions
```

**Exemplos de possíveis endpoints:**

| Provider | Host | Path |
|----------|------|------|
| PayEvo Padrão | api.payevo.com.br | /transactions |
| PayEvo v2 | api.payevo.com.br | /v2/pix/generate |
| PayEvo PIX | api.payevo.com.br | /pix |
| Outro | diferente.com.br | /seu-endpoint |

3. Clique em **Save**
4. Deploy novamente (Netlify faça o rebuild automaticamente)

---

## 📊 Endpoints Mais Comuns da PayEvo

Se você não conseguir encontrar, teste estes (em ordem de probabilidade):

- ✅ `/transactions` → Mais comum
- ✅ `/pix/create` 
- ✅ `/api/transactions`
- ✅ `/v1/pix/generate`
- ✅ `/v2/pix/generate`

---

## 🧪 Como Testar Após Configurar

1. Assim que alterar as variáveis e fazer deploy (3-5 min)
2. Acesse seu site
3. Clique em "FINALIZAR PEDIDO"
4. Preencha os dados e clique "Gerar PIX"
5. Se ainda der 404, significa que o endpoint ainda é diferente

---

## 💡 Dica de Debug

Se precisar testar localmente antes, você pode usar `curl`:

```bash
curl -X POST https://api.payevo.com.br/transactions \
  -H "Content-Type: application/json" \
  -H "X-Public-Key: sua-chave-publica" \
  -H "X-Secret-Key: sua-chave-secreta" \
  -d '{"amount": 1990, "customer": {"name": "Teste", "cpf": "00000000191"}}'
```

Se funcionar, use esse endpoint no Netlify!

---

## 📞 Próximas Ações

**Me confirme qual endpoint descobriu** que faço a testerá para você:

1. Você descobriu qual é o endpoint?
2. Qual é o caminho exato? (ex: `/transactions`, `/pix/generate`, etc)
3. Alterou as variáveis no Netlify?

Depois é só testar novamente no site! 🚀
