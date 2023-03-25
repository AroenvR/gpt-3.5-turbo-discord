Initial readme file.

## Requirements for creating a new Discord Bot:  
Create a new Application in the Discord Developer Portal.  
Put the General Information -> Application ID in your safe environment.  
Create a Bot -> Build-A-Bot.  
Give it a Username.  
Put the Bot -> Token into your safe environment.  
Turn on the Bot -> Message Content Intent on.  
Create a OAuth2 -> General -> Default Authorization Link -> Custom URL.  
Fill in the Custom URL with => https://discord.com/oauth2/authorize?scope=bot&permissions=8&client_id=YOUR_CLIENT_ID  
Create a new IDiscordBot in the getDiscordBots method (or API in the future).  
Get your @DiscordID (send a message and log it in your server, use that ID tag).  
Add that to your safe environment.  

## Requirements for creating a new AI:  
Create a new folder inside ai_class_prompts: "my_ai"  
Then create an AI primer file: My_AI.AI  
Add it to appConfig  
Optionally add it to package.json  
Add it to the aiService.ts switch statement.