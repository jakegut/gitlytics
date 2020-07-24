from requests_oauthlib import OAuth2Session
import settings

def add_webhook(full_name, oauth_token):
    url = f'{settings.GITHUB_API_BASE_URL}repos/{full_name}/hooks'
    params = {
        'events': ['push'],
        'config': {
            'url': settings.GITHUB_WEBHOOK_URL,
            'content_type': 'json',
            'secret': settings.GITHUB_WEBHOOK_SECRET,
            'insecure_ssl': ('0' if 'https' in settings.GITHUB_WEBHOOK_URL else '1')
        }
    }
    github = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID, token={"access_token": oauth_token})
    webhook_data = github.post(url, json=params).json()
    return webhook_data