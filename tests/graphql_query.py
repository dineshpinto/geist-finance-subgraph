import requests
import json
from pprint import pprint


query = """{
  tokens(first: 5) {
    id
    name
    symbol
    decimals
  }
  rewardTokens(first: 10) {
    id
    name
    symbol
    decimals
    type
  }
}"""

url = 'https://api.thegraph.com/subgraphs/id/Qmczn5YUhWgETtFewJiyctcjA5zBwmXBxmPKrKCTGX72k4'

if __name__ == '__main__':
    # Generate a POST request with the query string to the host URL
    r = requests.post(url, json={'query': query})

    # Extract relevant info from result
    data = json.loads(r.text)
    pprint(data)