import { Bot, Context, session, webhookCallback } from "grammy";
import SteamClient from "./utils/steam";

interface SessionData {}

// 扩展 Context 类型
interface MyContext extends Context {
  session: SessionData;
  config: {
    botDeveloper: number;
  };
}

async function middleware(ctx: MyContext, next: () => Promise<void>) {
  // 将环境变量中的字符串 USER_ID 转换为数字
  const developerId = ctx.config.botDeveloper;
  const userId = ctx.from?.id;

  console.log(`用户 ID: ${userId} 正在使用 Bot`);

  if (userId === developerId) {
    await next();
  } else {
    await ctx.reply(`你没有权限使用这个机器人。`);
    return;
  }
}

export default {
  async fetch(request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    // 创建 bot 实例，指定类型为 MyContext
    const bot = new Bot<MyContext>(env.BOT_TOKEN);

    // 初始化会话中间件
    bot.use(session({ initial: () => ({}) }));

    // 添加配置到上下文
    bot.use(async (ctx, next) => {
      ctx.config = {
        botDeveloper: Number(env.USER_ID),
      };
      await next();
    });

    bot.use(middleware);
    bot.command("start", async (ctx) => {
      await ctx.reply(
        "Hello, Welcome to use Cloudflare Steam App. Build by RealTong.💛"
      );
    });
    const steamClient = new SteamClient(
      env.STEAM_API_KEY,
      env.STEAM_SETUP_CODE,
      env.STEAM_USER_ID
    );
    bot.command("2fa", async (ctx) => {
      await ctx.reply(`||${await steamClient.get2FACode()}||`, {
        parse_mode: "MarkdownV2",
      });
    });

    bot.command("me", async (ctx) => {
      const myInfo = await steamClient.getMyInfo();
      await ctx.reply(
        `*🎮 Steam Profile*\n\n` +
          `🪪 *Steam ID:* \`${myInfo.steamID}\`\n` +
          `👤 *Nickname:* ${myInfo.nickname}\n` +
          `📅 *Created:* ${myInfo.createdTime}`,
        {
          parse_mode: "MarkdownV2",
        }
      );
    });

    bot.command("games", async (ctx) => {
      const limit = ctx.match ? Number(ctx.match[1]) : 5;
      const myGames = await steamClient.getMyGames(limit);

      // Header for the games list
      let message = `*🎮 My Top ${myGames.length} Games*\n\n`;

      // Add each game with proper formatting
      message += myGames
        .map(
          (game, index) =>
            `*${index + 1}\\. ${game.name}*\n` +
            `⏱ *游戏时间:* \`${game.playtime}\`\n` +
            `📅 *最后游玩:* \`${game.lastPlayedTimestamp}\``
        )
        .join("\n\n");

      await ctx.reply(message, {
        parse_mode: "MarkdownV2",
      });
    });

    return webhookCallback(bot, "cloudflare-mod")(request);
  },
} satisfies ExportedHandler<Env>;
