const telegramApi = require('node-telegram-bot-api');

const token = '5286724016:AAGtKZczG3lTOHLAAQEzrdps0S2_DaZykhw';

const bot = new telegramApi(token, {polling:true});

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text:'Play again', callback_data:'/again'}],
        ]
    })
}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text:'1', callback_data:'1'}, {text:'2', callback_data:'2'}, {text:'3', callback_data:'3'}],
            [{text:'4', callback_data:'4'}, {text:'5', callback_data:'5'}, {text:'6', callback_data:'6'}],
            [{text:'7', callback_data:'7'}, {text:'8', callback_data:'8'}, {text:'9', callback_data:'9'}],
            [{text:'0', callback_data:'0'}],
        ]
    })
}

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'Guess number between 0 and 9');
    const randomNumber = Math.floor(Math.random() * 10);
    numbers[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Choose the number', gameOptions);
}

const numbers = {};

const start = () =>{
    bot.setMyCommands([
        {command: '/start', description: "Greetings on visit"},
        {command: '/info', description: "Get info about bot"},
        {command: '/game', description: "Game where you guess number"},
    ]);
    
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/345/7c2/3457c236-4b9c-3e7c-aa95-939ffbd6781a/1.webp');
            return bot.sendMessage(chatId, 'Welcome');
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, 'Nothing to share yet');
        }
        if(text === '/game'){
            return startGame(chatId);
        }
        
    return bot.sendMessage(chatId, "I don't get it");

    });

    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;

        console.log(numbers[chatId]);
        if(data == '/again'){
            return startGame(chatId)
        }

        if(data == numbers[chatId]){
           return bot.sendMessage(chatId, 'Correct!', againOptions);
        }
        else{
            return bot.sendMessage(chatId, `Unfortunately number ${data} isn't correct, it was ${numbers[chatId]}`, againOptions);
        }
    });
}

start();