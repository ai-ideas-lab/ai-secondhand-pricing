# AI 二手智能定价

面向二手物品卖家的定价与发布文案助手。上传物品照片并补充品牌、型号、成色和购入信息后，可得到价格区间、市场趋势、近期成交参考，以及适配闲鱼、转转和朋友圈的发布文案。

- 线上地址：https://ai-secondhand-pricing.vercel.app
- GitHub：https://github.com/ai-ideas-lab/ai-secondhand-pricing
- 技术栈：React 19、TypeScript、Vite、Tailwind CSS、Radix UI

## 本地运行

```bash
npm install
npm run dev
```

当前估价和文案生成为前端模拟逻辑，不需要模型 API Key。若接入真实后端，可复制 `.env.example` 并配置公开 API 地址；模型密钥必须保存在服务端或部署平台的私有环境变量中。

## 验证

```bash
npm run test
npm run lint
npm run build
```

部署和环境说明见 [DEPLOYMENT.md](./DEPLOYMENT.md)。
