# Audio Converter Server

Servidor Node.js para conversão de áudio WebM → OGG usando FFmpeg.

## Instalação Local

```bash
cd audio-converter-server
npm install
npm start
```

O servidor iniciará na porta 3001.

## Endpoints

### POST /convert-audio
Converte áudio WebM para OGG.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: arquivo de áudio com campo `audio`

**Response:**
- Content-Type: `audio/ogg`
- Body: arquivo OGG convertido

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "audio-converter"
}
```

## Deploy no Render

1. Faça push do código para GitHub
2. Conecte seu repositório no [Render.com](https://render.com)
3. O deploy será automático usando `render.yaml`
4. Configure a variável `ALLOWED_ORIGINS` com o domínio do seu app

## Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3001)
- `ALLOWED_ORIGINS`: Lista de origens permitidas separadas por vírgula (padrão: *)

## Requisitos

- Node.js 18+
- FFmpeg (instalado automaticamente no Docker/Render)
