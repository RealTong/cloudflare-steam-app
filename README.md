# Cloudflare Steam App

### One Click Deploy
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/RealTong/cloudflare-steam-app)

### Manual Setup
1. 克隆仓库 `git clone https://github.com/RealTong/cloudflare-steam-app.git && cd cloudflare-steam-app`
2. `pnpm install` or `npm install`
3. 设定环境变量

```bash
npx wrangler secret put STEAM_SETUP_CODE # Steam 配置密钥
npx wrangler secret put STEAM_API_KEY # Steam API Key
npx wrangler secret put KEY # 获取代理配置时候使用的密钥
npx wrangler secret put USER_ID # Bot 开发者 ID
npx wrangler secret put BOT_TOKEN # Bot Token
```

4. `pnpm run deploy`

### Usage

- `https://t.me/@YOUR_BOT_NAME?start`

### Screenshot

![Screenshot](https://raw.githubusercontent.com/RealTong/cloudflare-steam-app/main/demo.jpeg)
