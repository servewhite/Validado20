# PLANO DE AÇÃO - ADIÇÃO DE SCRIPTS FALTANTES

## 🔴 CRÍTICO: Adicionar "finalizar-pedido-helper.js"

### 1. PÁGINA PRINCIPAL - AÇÃO IMEDIATA

**Arquivo:** `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\index.html`

**Ação:** Adicionar antes da tag `</body>`:
```html
<script src="js/finalizar-pedido-helper.js"></script>
```

**Linha sugerida:** Aproximadamente linha 6720 (antes do fechamento de body)

---

### 2. PÁGINAS DE PAGAMENTO - AÇÃO IMEDIATA

Adicionar em cada um dos seguintes arquivos (ANTES DA TAG </body>):

```html
<script src="../../js/finalizar-pedido-helper.js"></script>
```

**Arquivos:**

1. `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\produtos\marmita\pagamentos\pagamento1\pagamento1.html`
   - Linha sugerida: Final do documento, antes de </body>

2. `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\produtos\marmita\pagamentos\pagamento2\pagamento2.html`
   - Linha sugerida: Final do documento

3. `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\produtos\marmita\pagamentos\pagamento3\pagamento3.html`
   - Linha sugerida: Final do documento

4. `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\produtos\marmita\pagamentos\pagamento6\pagamento6.html`
   - Linha sugerida: Final do documento

5. `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\produtos\marmita\pagamentos\pagamento7\pagamento7.html`
   - Linha sugerida: Final do documento

6. `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\produtos\marmita\pagamentos\pagamento8\pagamento8.html`
   - Linha sugerida: Final do documento

7. `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\produtos\marmita\pagamentos\pagamento9\pagamento9.html`
   - Linha sugerida: Final do documento

---

### 3. ARQUIVOS ESPELHADOS - AÇÃO SECUNDÁRIA

Os seguintes diretórios contêm cópias espelhadas que também devem ser atualizadas:

**Diretórios:**
- `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\br01\`
- `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\cdn.xtracky.com\`
- `c:\Users\gabri\Downloads\clone man\validadomasao.netlify.app\connect.facebook.net\`

**Recomendação:** Re-sincronizar esses diretórios com ferramentas como HTTrack após fazer as alterações nos arquivos principais.

---

## ⚠️ MÉDIA PRIORIDADE: Padronizar PIX Integration

### Situação Atual (INCONSISTÊNCIA)

**Variação 1 - Produtos (OK):**
```html
<script src="../../js/pix-integration3661.js?v=2.0" defer></script>
```
- Localização: Linhas 753-754 em arquivos de produto
- Versão: 3661
- Status: ✅ CONSISTENTE

**Variação 2 - Página Principal:**
```html
<script src="js/pix-integration.js" type="module"></script>
```
- Localização: Linha 6712
- Tipo: ES6 Module
- Status: ⚠️ DIFERENTE

**Variação 3 - Pagamentos:**
```html
<script src="../../js/pix-integration.html"></script>
```
- Arquivo: pix-integration.html
- Status: ⚠️ REFERENCIANDO ARQUIVO HTML

### Recomendação

**Ação 1:** Verificar qual é a versão CORRETA:
- `pix-integration.js` (versão modular)
- `pix-integration3661.js` (versão 3661)

**Ação 2:** Padronizar TODAS as páginas:
```html
<!-- OPÇÃO A: Usar versão 3661 em todas -->
<script src="../../js/pix-integration3661.js?v=2.0" defer></script>

<!-- OU -->

<!-- OPÇÃO B: Usar versão modular em todas -->
<script src="js/pix-integration.js" type="module"></script>
```

---

## 🟢 VALIDAÇÃO: Testar Caminhos Relativos

Depois de adicionar os scripts, validar se os caminhos relativos resolvem:

### Para páginas em `produtos/marmita/` (profundidade: 2 níveis):
```
../../js/finalizar-pedido-helper.js
├── .. (sobe para: validadomasao.netlify.app/produtos)
├── .. (sobe para: validadomasao.netlify.app)
└── js/finalizar-pedido-helper.js ✅ CORRETO
```

### Para páginas em `produtos/marmita/pagamentos/pagamento1/` (profundidade: 4 níveis):
```
../../js/finalizar-pedido-helper.js
├── .. (sobe para: validadomasao.netlify.app/produtos/marmita/pagamentos)
├── .. (sobe para: validadomasao.netlify.app/produtos/marmita)
└── js/finalizar-pedido-helper.js ❌ INCORRETO!

CORRETO DEVERIA SER:
../../../js/finalizar-pedido-helper.js
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 - CRÍTICO (Fazer Primeiro)
- [ ] Adicionar `finalizar-pedido-helper.js` em `index.html`
- [ ] Adicionar em `pagamento1.html`
- [ ] Adicionar em `pagamento2.html`
- [ ] Adicionar em `pagamento3.html`
- [ ] Adicionar em `pagamento6.html`
- [ ] Adicionar em `pagamento7.html`
- [ ] Adicionar em `pagamento8.html`
- [ ] Adicionar em `pagamento9.html`
- [ ] Validar caminhos relativos
- [ ] Testar páginas em navegador

### Fase 2 - PADRONIZAÇÃO (Depois de Fase 1)
- [ ] Definir versão única de pix-integration
- [ ] Unificar em todas as páginas
- [ ] Remover referências .html

### Fase 3 - CACHE/ESPELHADOS (Opcional)
- [ ] Re-sincronizar diretório br01/
- [ ] Re-sincronizar cdn.xtracky.com/
- [ ] Re-sincronizar connect.facebook.net/
- [ ] Ou usar script de atualização em batch

---

## ⚙️ ALTERNATIVA: Usar URL Absoluta

Se houver problemas com caminhos relativos, considerar usar URL absoluta:

```html
<!-- Ao invés de: -->
<script src="../../js/finalizar-pedido-helper.js"></script>

<!-- Usar: -->
<script src="https://cdn.utmify.com.br/js/finalizar-pedido-helper.js"></script>
<!-- ou -->
<script src="https://validadomasao.netlify.app/js/finalizar-pedido-helper.js"></script>
```

---

## 📞 PRÓXIMOS PASSOS RECOMENDADOS

1. **Análise de Dependência:**
   - Verificar se `finalizar-pedido-helper.js` tem dependências
   - Certificar-se de que biblioteca jQuery está carregada antes
   - Verificar conflitos com outras bibliotecas

2. **Testes:**
   - Teste em diversos navegadores
   - Validar com DevTools (F12) - verificar Console para erros
   - Testar fluxo completo de checkout

3. **Documentação:**
   - Documentar versões de cada script
   - Manter registro de atualizações
   - Criar SOP (Standard Operating Procedure) para adição de novos scripts

4. **Monitoramento:**
   - Implementar logs/analytics para falhas de script
   - Monitorar performance das páginas
   - Acompanhar comportamento do usuário

---

**Data de Recomendação:** 20 de Fevereiro de 2026
**Criticidade GERAL:** 🔴 ALTA - Implementar o quanto antes
**Tempo Estimado:** 30-60 minutos (incluindo testes)
