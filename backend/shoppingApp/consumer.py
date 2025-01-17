# shoppingApp/consumers.py

from channels.generic.websocket import AsyncWebsocketConsumer
from backend.utils import get_dashboard_stats
import json
from time import sleep

class DashboardStatsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get('user')

        
        if self.user is None:
            print("Not Authenticated")
            await self.close()
            return

        
        await self.accept()
        self.group_name = "dashboard_group"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.send_dashboard_stats()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_dashboard_stats(self):
        
        
        stats = await get_dashboard_stats()
        await self.send(text_data=json.dumps(stats))

    async def update_stats(self, event):
        sleep(1)
        # Optionally, handle the event data if needed
        await self.send_dashboard_stats()
