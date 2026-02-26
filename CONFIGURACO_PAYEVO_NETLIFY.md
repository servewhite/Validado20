# 🔧 Configuração PayEvo no Netlify

## 📋 Variáveis de Ambiente Necessárias

Acesse: **Site Settings → Environment → Environment variables**

Cadastre as seguintes variáveis (já devem estar lá):

### 1️⃣ Chave Pública (OBRIGATÓRIO)

`PAYEVO_PUBLIC_KEY` = sua-chave-publica-payevo

**Encontre em:** PayEvo Dashboard → Configurações → API → Public Key

### 2️⃣ Chave Privada/Secreta (OBRIGATÓRIO)

`PAYEVO_SECRET_KEY` = sua-chave-secreta-payevo

**Encontre em:** PayEvo Dashboard → Configurações → API → Secret Key

### 3️⃣ Configuração de API (OPCIONAL)

Se a PayEvo forneceu um endpoint diferente:

- `PAYEVO_API_HOST` (padrão: `api.payevo.com.br`)
- `PAYEVO_API_PATH` (padrão: `/pix/generate`)

**Exemplos:**
```
PAYEVO_API_HOST = api.v2.payevo.com.br
PAYEVO_API_PATH = /v2/pix/create
```

---

## 📝 Checklist de Configuração

- [ ] As credenciais `PAYEVO_PUBLIC_KEY` estão corretas?
- [ ] As credenciais `PAYEVO_SECRET_KEY` estão corretas?
- [ ] Clicou em "Save" no Netlify?
- [ ] Aguardou rebuild do site (~5-10 min)?
- [ ] Fez um teste de pagamento?

---

## 🐛 Troubleshooting

### ❌ "Chave PIX não existe"

**Causa 1:** Chaves inválidas ou expiradas
- Solução: Verifique no dashboard da PayEvo se as chaves ainda são válidas
- Regenere as chaves se necessário

**Causa 2:** Endpoint incorreto
- Solução: Confirme o endpoint com suporte PayEvo
- Verifique se `PAYEVO_API_HOST` e `PAYEVO_API_PATH` estão corretos

**Causa 3:** Dados do pedido incompletos
- Solução: Verifique se CPF, nome e valor estão sendo enviados corretamente

---

## 🔍 Como Verificar se Está Funcionando

Após confirmar as variáveis:

1. Faça um pedido no site
2. Clique em "FINALIZAR PEDIDO"
3. Preencha os dados e clique "Gerar PIX"
4. Acesse **Netlify → Functions → create-payevo-transaction**
5. Procure pelos logs:
   - ✅ Deve mostrar: `✅ Credenciais PayEvo encontradas`
   - ✅ Deve mostrar: `✅ [PayEvo] PIX gerado com sucesso` 
   - ❌ Se der erro, veja os detalhes para saber o que ajustar

---

## 📊 Logs de Debug

O sistema agora loga:
- ✅ Quais variáveis de ambiente foram encontradas (com primeiros 10 caracteres)
- ✅ Endpoint sendo usado
- ✅ Dados enviados à API
- ✅ Headers de autenticação
- ❌ Erros completos da API PayEvo (ajuda a diagnosticar)

---

## 🔗 Links Úteis

- [PayEvo Dashboard](https://app.payevo.com.br)
- [Documentação PayEvo](https://docs.payevo.com.br)
- [Suporte PayEvo](https://suporte.payevo.com.br)

