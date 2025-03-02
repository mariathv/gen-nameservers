import requests
import json
from typing import Dict, Any, List, Optional
from app.core.config import settings

class CloudflareService:
    def __init__(self):
        self.api_key = settings.CLOUDFLARE_API_KEY
        self.email = settings.CLOUDFLARE_EMAIL
        self.account_id = settings.CLOUDFLARE_ACCOUNT_ID
        self.base_url = "https://api.cloudflare.com/client/v4"
        self.headers = {
            "X-Auth-Email": self.email,
            "X-Auth-Key": self.api_key,
            "Content-Type": "application/json"
        }
    
    async def register_domain(self, domain: str) -> Dict[str, Any]:
        """
        Register a domain with Cloudflare and get nameservers.
        """
        url = f"{self.base_url}/zones"
        payload = {
            "name": domain,
            "account": {"id": self.account_id},
            "jump_start": True
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            data = response.json()
            
            if data["success"]:
                zone_id = data["result"]["id"]
                nameservers = data["result"]["name_servers"]
                
                return {
                    "success": True,
                    "zone_id": zone_id,
                    "nameservers": nameservers
                }
            else:
                return {
                    "success": False,
                    "error": data["errors"][0]["message"] if data["errors"] else "Unknown error"
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_domain(self, domain: str) -> Dict[str, Any]:
        """
        Get information about a domain from Cloudflare.
        """
        url = f"{self.base_url}/zones?name={domain}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            if data["success"] and data["result"]:
                zone = data["result"][0]
                return {
                    "success": True,
                    "zone_id": zone["id"],
                    "nameservers": zone["name_servers"],
                    "status": zone["status"]
                }
            else:
                return {
                    "success": False,
                    "error": "Domain not found"
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def delete_domain(self, domain: str) -> Dict[str, Any]:
        """
        Delete a domain from Cloudflare.
        """
        # First, get the zone ID
        domain_info = await self.get_domain(domain)
        
        if not domain_info["success"]:
            return domain_info
        
        zone_id = domain_info["zone_id"]
        url = f"{self.base_url}/zones/{zone_id}"
        
        try:
            response = requests.delete(url, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            if data["success"]:
                return {
                    "success": True,
                    "message": "Domain deleted successfully"
                }
            else:
                return {
                    "success": False,
                    "error": data["errors"][0]["message"] if data["errors"] else "Unknown error"
                }
        
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e)
            }