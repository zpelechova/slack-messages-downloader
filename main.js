import { Actor } from 'apify';
import {
    WebClient,
} from '@slack/web-api';

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

await Actor.init();
const input = await Actor.getInput();
console.log(input);
const time = new Date().getTime();
console.log(time);
const latest = (time/1000).toString();
console.log(latest);
const oldest = (addDays(time, Number(input.oldest) * -1).getTime()) / 1000;
console.log(oldest);
const client = new WebClient(input.token);

await client.conversations.join({ channel: input.channel });

const { messages } = await client.conversations.history({
    channel: input.channel,
    oldest,
    latest,
    limit: 1000,
});

const filteredMessages = [];
for (const message of messages) {
    const date = new Date(Number(message.ts) * 1000);
    const parsedDate = date.getFullYear() + "-" + (Number(( "0" + date.getMonth()).slice(-2)) + 1)  + "-" + ("0" + date.getDate()).slice(-2)
    message.date = parsedDate;
    filteredMessages.push(message);
}

await Actor.pushData(filteredMessages);

await Actor.exit();
