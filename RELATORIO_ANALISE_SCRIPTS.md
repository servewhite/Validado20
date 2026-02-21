# RELATÓRIO DE ANÁLISE DE SCRIPTS HTML
**Data da Análise:** 20 de Fevereiro de 2026
**Diretórios Analisados:**
- `validadomasao.netlify.app/`
- `validadomasao.netlify.app/produtos/marmita/`

---

## 📊 RESUMO EXECUTIVO

| Métrica | Valor |
|---------|-------|
| **Total de arquivos HTML analisados** | 344 |
| **Arquivos com utms/latest.js** | ~200+ (limite de busca) |
| **Arquivos SEM utms/latest.js** | ~144 (estimado) |
| **Arquivos com pixel/pixel.js** | ~200+ (limite de busca) |
| **Arquivos com finalizar-pedido-helper.js** | 14 |
| **Arquivos com pix-integration** | 158 |

---

## 🔍 VERIFICAÇÃO 1: Script de UTM Tracking
### `https://cdn.utmify.com.br/scripts/utms/latest.js`

**Status:** ✅ PRESENTE EM MÚLTIPLOS ARQUIVOS

**Contagem:** 200+ matches (limite da busca atingido)

### Arquivos COM o script (principais encontrados):

#### Página Principal:
- `index.html` (linha 120)
- `title_Instagram_.html` (linha 120)

#### Seção de Produtos (productos/marmita/):
- `marmita6.html` (linha 117)
- `marmita6-2.html` (linha 117)
- `marmita7.html` (linha 116)
- `marmita7-2.html` (linha 116)
- `marmita8.html` (linha 117)
- `marmita8-2.html` (linha 117)
- `marmita9.html` (linha 117)
- `marmita9-2.html` (linha 117)

#### Seção "Pague 1 Leve 2":
- `pague-1-leve-2-marmita2.html` (linha 116)
- `pague-1-leve-2-marmita2-2.html` (linha 116)
- `pague-1-leve-2-marmita3.html` (linha 116)
- `pague-1-leve-2-marmita3-2.html` (linha 116)
- `pague-1-leve-2-marmita11.html` (linha 116)
- `pague-1-leve-2-marmita11-2.html` (linha 116)

#### Páginas de Pagamento:
- `pagamentos/pagamento1/pagamento1.html` (linha 18)
- `pagamentos/pagamento2/pagamento2.html` (linha 18)
- `pagamentos/pagamento3/pagamento3.html` (linha 18)
- `pagamentos/pagamento6/pagamento6.html` (linha 18)
- `pagamentos/pagamento7/pagamento7.html` (linha 18)
- `pagamentos/pagamento8/pagamento8.html` (linha 18)
- `pagamentos/pagamento9/pagamento9.html` (linha 18)

#### Diretórios de Cache/Espelho:
- `br01/` (múltiplos arquivos)
- `cdn.xtracky.com/` (múltiplos arquivos)
- `connect.facebook.net/` (múltiplos arquivos)

### Arquivos SEM o script:
⚠️ **Estimado: ~144 arquivos** (considerando 344 total - 200 encontrados)

Provável em alguns arquivos de:
- Diretórios de cache/espelho (i.postimg.cc/, files.catbox.moe/)
- Alguns arquivos de configuração e espelhos do HTTrack

---

## 🔍 VERIFICAÇÃO 2: Pixel da Utmify
### `https://cdn.utmify.com.br/scripts/pixel/pixel.js`

**Status:** ✅ PRESENTE EM MÚLTIPLOS ARQUIVOS

**Contagem:** 200+ matches (limite da busca atingido)

**Padrão Encontrado:** Carregamento dinâmico via JavaScript
```javascript
a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
```

### Distribuição:
- ✅ Presente em praticamente todas as páginas de produto (marmita*.html)
- ✅ Presente em páginas "Pague 1 Leve 2"
- ✅ Presente em páginas de pagamento
- ✅ Presente em páginas espelhadas nos diretórios clone

**Observação Importante:** O pixel é carregado dinamicamente através de script, não como tag estática.

---

## 🔍 VERIFICAÇÃO 3: Script de Checkout
### `finalizar-pedido-helper.js`

**Status:** ⚠️ LIMITADO - Presente em APENAS 14 arquivos

**Contagem:** 14 matches

### Arquivos COM o script:

**Arquivos "Pague 1 Leve 2":**
1. `pague-1-leve-2-marmita2.html` (linha 754)
2. `pague-1-leve-2-marmita2-2.html` (linha 754)
3. `pague-1-leve-2-marmita3.html` (linha 754)
4. `pague-1-leve-2-marmita3-2.html` (linha 754)
5. `pague-1-leve-2-marmita11.html` (linha 754)
6. `pague-1-leve-2-marmita11-2.html` (linha 754)

**Arquivos de Produto Direto:**
7. `marmita6.html` (linha 755)
8. `marmita6-2.html` (linha 755)
9. `marmita7.html` (linha 754)
10. `marmita7-2.html` (linha 754)
11. `marmita8.html` (linha 755)
12. `marmita8-2.html` (linha 755)
13. `marmita9.html` (linha 755)
14. `marmita9-2.html` (linha 755)

### Arquivos SEM o script:
❌ **Estimado: ~330 arquivos**

**Faltam em:**
- ❌ Todas as páginas de pagamento (`pagamentos/pagamento*/`)
- ❌ Página principal (`index.html`)
- ❌ Página de thumbnail (`title_Instagram_.html`)
- ❌ Todos os arquivos em diretórios espelhados
- ❌ Todos os arquivos em diretórios complementares

### ⚠️ CRÍTICO - Caminho do Script:
```html
<script src="../../js/finalizar-pedido-helper.js"></script>
```
O script usa referência relativa. Verificar se está na localização correta.

---

## 🔍 VERIFICAÇÃO 4: Scripts de Pagamento PIX
### `pix-integration` (múltiplas variações)

**Status:** ✅ PRESENTE EM 158 arquivos

**Contagem:** 158 matches

### Variações Encontradas:

#### 1. **Script Principal Direto:**
```html
<script src="../../js/pix-integration3661.js?v=2.0" defer></script>
```
**Localização:** Páginas de produto e "Pague 1 Leve 2"

#### 2. **Script em Formato ES6 Module:**
```html
<script src="js/pix-integration.js" type="module"></script>
```
**Localização:** Páginas principais (index.html, title_Instagram_.html)

#### 3. **Referência em Pagamento:**
```html
<script src="../../js/pix-integration.html"></script>
```
**Localização:** Páginas de pagamento

### Distribuição por Tipo de Página:

| Tipo | Presença | Detalhes |
|------|----------|----------|
| Produtos (marmita*.html) | ✅ SIM | Versão 3661 com defer |
| Pague 1 Leve 2 | ✅ SIM | Versão 3661 com defer |
| Pagamentos | ✅ SIM | Referência em HTML |
| Principais | ✅ SIM | Formato modular ES6 |
| Espelhadas | ✅ SIM | Distribuídas em diretórios clone |
| Pixel-Integration.js | ✅ SIM | Arquivo duplicado como .html |

---

## 📋 ANÁLISE DE COMPLEMENTARIDADE

### Páginas COM TODOS os scripts esperados:
✅ **Páginas de Produto:**
- `marmita6.html` até `marmita9.html` (e variações -2)
- Scripts: UTM ✅ + Pixel ✅ + Checkout ✅ + PIX ✅

✅ **Páginas "Pague 1 Leve 2":**
- `pague-1-leve-2-marmita2.html` até `pague-1-leve-2-marmita11.html` (e variações)
- Scripts: UTM ✅ + Pixel ✅ + Checkout ✅ + PIX ✅

### Páginas COM scripts INCOMPLETOS:
⚠️ **Páginas de Pagamento:**
- Scripts: UTM ✅ + Pixel ✅ + Checkout ❌ + PIX ✅
- **Falta:** finalizar-pedido-helper.js

⚠️ **Página Principal (index.html):**
- Scripts: UTM ✅ + Pixel ✅ + Checkout ❌ + PIX ✅
- **Falta:** finalizar-pedido-helper.js

---

## 🎯 CONCLUSÕES E RECOMENDAÇÕES

### Status Geral: ⚠️ PARCIALMENTE COMPLETO

### Pontos Fortes:
✅ **Rastreamento UTM**: Implementado em ~200+ arquivos (59%+)
✅ **Pixel de Conversão**: Implementado em ~200+ arquivos (59%+)
✅ **Integração PIX**: Implementada em 158 arquivos (46%)

### Pontos Críticos - AÇÃO NECESSÁRIA:
❌ **Script de Checkout** (`finalizar-pedido-helper.js`):
- Implementado em apenas 14 arquivos
- **Falta em ~330 arquivos** (96% dos documentos)
- Recomendação: Adicionar a todas as páginas de produto, pagamento e página principal

### Recomendações de Melhoria:

1. **Adicionar `finalizar-pedido-helper.js` em:**
   - Todas as páginas de pagamento
   - Página principal (index.html)
   - Todos os arquivos espelhados

2. **Verificar Referências Relativas:**
   - Validar se `../../js/finalizar-pedido-helper.js` resolve corretamente
   - Considerar usar caminhos absolutos ou URLs completas

3. **Padronizar Carregamento de PIX:**
   - Há inconsistência entre versões (3661, modular, .html)
   - Recomendação: Unificar para uma única versão

4. **Auditoria de Cache/Espelhado:**
   - Verificar por que alguns arquivos nos diretórios br01/, cdn.xtracky.com/, etc. não têm todos os scripts
   - Possível problema de sincronização do HTTrack

---

## 📁 Estrutura de Diretórios Afetados

```
validadomasao.netlify.app/
├── index.html                    (UTM ✅, Pixel ✅, Checkout ❌, PIX ✅)
├── title_Instagram_.html         (UTM ✅, Pixel ✅, Checkout ❌, PIX ✅)
│
├── produtos/marmita/
│   ├── marmita6-9.html          (UTM ✅, Pixel ✅, Checkout ✅, PIX ✅)
│   ├── pague-1-leve-2-*.html    (UTM ✅, Pixel ✅, Checkout ✅, PIX ✅)
│   ├── pagamentos/
│   │   └── pagamento*/          (UTM ✅, Pixel ✅, Checkout ❌, PIX ✅)
│   └── js/
│       ├── pix-integration.js
│       ├── pix-integration3661.js
│       └── finalizar-pedido-helper.js
│
├── br01/                         (Cópias com mesma estrutura)
├── cdn.xtracky.com/             (Cópias de cache)
└── connect.facebook.net/        (Cópias de cache)
```

---

**Análise Completa** | Relatório Gerado: 20/02/2026
