"use server";

import { isProduction } from "@/utils/misc";
import { MessageCreateOptions } from "discord.js";

const orderChannelId = "1382393907010211980";

export const sendOrderMessage = async (data: MessageCreateOptions) => {
  return sendDiscordMessage(orderChannelId, data);
};

const sendDiscordMessage = async (
  channelId: string,
  data: MessageCreateOptions
) => {
  if (!isProduction) {
    console.info("Skipping Discord message in non-production environment");
    return;
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Discord API error:", errorData);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
