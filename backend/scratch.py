import requests

url = "http://localhost:8000/api/kehadiran?tahun=2025&semester=2"
headers = {"Authorization": "Bearer " + open("token.txt").read().strip()} if __import__("os").path.exists("token.txt") else {}
try:
    r = requests.get(url, headers=headers)
    print(r.status_code)
    print(r.text)
except Exception as e:
    print(e)
