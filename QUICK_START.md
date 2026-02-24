# 🚀 GUIA RÁPIDO - Ativar Geração de QR Code PIX

## ⏱️ Tempo: ~5 minutos

### O que foi feito?
✅ Criadas Netlify Functions para gerar QR Code  
✅ Configurado netlify.toml  
✅ Pronto para deploy!

---

## 🔧 3 Passos para Ativar

### 1️⃣ **Sincronizar com Git**

```powershell
cd "c:\Users\gabri\Downloads\clone man"
git add netlify/ netlify.toml .env.example SETUP_FUNCTIONS.md
git commit -m "feat: adicionar Netlify Functions para geração de PIX QR Code"
git push
```

### 2️⃣ **Configurar Credenciais PayEvo (no Netlify Dashboard)**

- Acesse: https://app.netlify.com
- Selecione seu site (mansaomaromba.netlify.app)
- Vá em: **Site Settings → Build & Deploy → Environment**
- Clique em **Edit variables**
- Adicione 2 variáveis:

| Variável | Valor |
|----------|-------|
| `PAYEVO_API_KEY` | `sk_live_...` (sua chave) |
| `PAYEVO_MERCHANT_ID` | `merch_...` (seu ID) |

> ⚠️ Se não tiver credenciais PayEvo ainda, a função funcionará em **MODO DEMO** (QR code simulado para testes)

### 3️⃣ **Deploy Automático**

✅ Pronto! Netlify fará deploy automático ao fazer push.

Aguarde ~1-2 minutos e teste em:
```
https://mansaomaromba.netlify.app/
```

---

## ✅ Testando

1. Abra o site
2. Selecione um produto
3. Clique em "FINALIZAR PEDIDO"
4. Preencha os dados
5. Clique em "Gerar PIX"

**Esperado:** QR Code aparecerá na tela ✅

**Se não aparecer:**
- Abra DevTools (F12)
- Console deve mostrar: `✅ [PAYEVO] PIX gerado com sucesso`
- Se ver `⚠️ MODO DEMO`, as credenciais não estão configuradas

---

## 🎯 Próximos Passos

1. Obtenha credenciais PayEvo:
   - Site: https://payevo.com.br
   - Versão Sandbox para testes
   - Versão Live para produção

2. Configure as variáveis no Netlify Dashboard

3. Teste novamente com credenciais reais

---

## 📞 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Erro 404 | Aguarde 2 min após push, ou forçar redeploy no Netlify |
| QR code não aparece | F12 → Console e verifique erros |
| "MODO DEMO" aparece | Configure `PAYEVO_API_KEY` no Netlify |
| Erro de CORS | Funções já têm CORS ativado, reinicie navegador |

---

**Status: ✅ Pronto para usar!**
