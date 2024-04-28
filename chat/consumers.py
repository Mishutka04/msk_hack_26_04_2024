# chat/consumers.py
import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

# Use a pipeline as a high-level helper

import requests

from FeedBackApp.serializers import AnswerSerializers



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        # Подключение к комнате
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Отключение от комнаты
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        #output = query({
        #    "inputs": message,
        #})
        #print(bool_inform(message))
        username = self.scope['user'].username
        id = text_data_json['id']

        serializer = AnswerSerializers(data={'answer':message, 'question': 1, 'user': 1})
        serializer.is_valid(raise_exception=True)
        serializer.save()
#

        # Отправка сообщения в комнату
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'message': message,
                'username': username,
                'id':id
            }
        )


    async def chat_message(self, event):
        # Отправка сообщения обратно на клиент

        message = event['message']
        username = event['username']
        id = event['id']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
        }))