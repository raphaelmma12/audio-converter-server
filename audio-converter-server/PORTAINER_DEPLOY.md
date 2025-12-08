# Deploy no Portainer - Passo a Passo

## 📦 Preparação

### 1. Commit e Push para GitHub

```bash
cd C:\Users\GABINETE\Documents\GitHub\app-gabconecte-v3-96415-94668
git add .
git commit -m "Add audio converter server for Portainer"
git push
```

## 🐳 Deploy no Portainer

### 2. Acessar Portainer

1. Acesse seu Portainer: `http://IP-DA-SUA-VPS:9000`
2. Faça login
3. Selecione seu **environment** (geralmente "local")

### 3. Criar Stack

1. No menu lateral, clique em **Stacks**
2. Clique em **+ Add stack**
3. Preencha:
   - **Name:** `audio-converter`
   - **Build method:** Escolha **Repository**

### 4. Configurar Repository

- **Repository URL:** `https://github.com/SEU-USUARIO/app-gabconecte-v3-96415-94668`
- **Repository reference:** `refs/heads/main` (ou `master`)
- **Compose path:** `audio-converter-server/docker-compose.yml`
- **Authentication:** Se repositório privado, adicione credentials

### 5. Variáveis de Ambiente (Importante!)

No campo **Environment variables**, adicione:

```
ALLOWED_ORIGINS=http://localhost:8080,https://SEU-DOMINIO-FRONTEND.com
```

**⚠️ Importante:** Substitua `SEU-DOMINIO-FRONTEND.com` pelo domínio real onde seu app está hospedado!

### 6. Deploy

1. Clique em **Deploy the stack**
2. Aguarde ~2-3 minutos
3. Portainer vai:
   - Clonar o repositório
   - Construir a imagem Docker (instala FFmpeg automaticamente)
   - Iniciar o container

### 7. Verificar

1. Vá em **Containers**
2. Procure `audio-converter`
3. Status deve estar **running** (verde)
4. Clique no container → **Logs** para ver se iniciou corretamente

Deve aparecer:
```
🎵 Audio Converter Server running on port 3001
📡 Health check: http://localhost:3001/health
```

## 🌐 Configurar Frontend

### 8. Descobrir a URL do Servidor

A URL será: `http://IP-DA-SUA-VPS:3001`

### 9. Atualizar .env do Frontend

```env
VITE_AUDIO_CONVERTER_URL=http://IP-DA-SUA-VPS:3001
```

**OU se tiver domínio configurado:**
```env
VITE_AUDIO_CONVERTER_URL=https://audio-converter.seu-dominio.com
```

### 10. Testar

1. Recarregue o app
2. Grave um áudio
3. Verifique:
   - No console do browser: deve mostrar conversão bem-sucedida
   - No Portainer → Container Logs: deve mostrar requests de conversão

## 🔧 Troubleshooting

### Container não inicia
- Verifique logs no Portainer
- Confirme que porta 3001 está livre

### Erro de CORS
- Atualize `ALLOWED_ORIGINS` com o domínio correto do frontend
- Redeploy a stack

### FFmpeg não encontrado
- Verifique se Dockerfile está instalando FFmpeg corretamente
- Logs devem mostrar instalação durante build

## 🔄 Atualizar Depois

Para atualizar o servidor após mudanças:

1. Commit e push no GitHub
2. No Portainer: Stacks → `audio-converter` → **Pull and redeploy**

---

**Pronto! Agora siga os passos acima e me avise em qual etapa você está!**
