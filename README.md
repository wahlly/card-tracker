# card-tracker

## Description
An internal service that combines data collected from partner companies in csv format and return the current status of the card when queried by a team mate

## Requirements
- docker
- docker-compose

## Running the app
```bash
      sudo docker-compose build 
```
```bash
      sudo docker-compose up
```

server should be live on port 3000

* Generating a new card
```curl -X POST http://localhost:3000/generate_new_card -d '{"userContact": "534534534"}'```
```json
      {
      "success": true,
      "message": "Card generated successfully",
      "statusCode": 200,
      "data":{
      "_id": "657a64d028c43024d53a05e7",
      "cardId": "ZYW0030",
      "userContact": "534534654"
            }
      }
```

* Get card status
```curl -X GET http://localhost:3000/get_card_status?cardId=ZYW8890```
```json
      {
      "success": true,
      "message": "Card status returned successfully",
      "statusCode": 200,
      "data": {
      "status": "returned",
      "cardId": "ZYW8890"
            }
      }
```
```curl -X GET http://localhost:3000/get_card_status?userContact=0585949014```
```json
      {
      "success": true,
      "message": "Card status returned successfully",
      "statusCode": 200,
      "data": {
      "status": "awaiting-pickup",
      "userContact": "0585949014"
            }
      }
```

## Approach
Considering the top level flow of the card operations given;
- card is generated
- card is picked up by courier partner
- card is delivered
- if card could not be delivered, re-delivery is attempted maximum of two times, after which it is returned.

The sample datasets folder in csv format, used to communicate with the courier partner is stored under the `data` folder. iterated through the csv datasets and rearranged them in another list according to the top-level flow. iterated through the files, starting from `pickup` csv file, if it has been picked up, move on to check if it has been delivered, after which the status can be returned as delivered, else if it has not been delivered, then check if it has failed twice so the `returned` file can be checked for if the card has been returned. If at the end of the iteration, the card has no logs in any of the files, the initial status `awaiting_pickup` will be sent, which tells that, the card has been created but yet to be picked up by the courier partner. Below are the status definitions used and their meaning;
- `awaiting_pickup` ->  a newly created card yet to be picked up
- `on_delivery` -> card has been picked by the courier
- `delivered` -> card has been delivered
- `failed_delivery` -> card delivery failed, and is to be re-delivered
- `returned` -> card has been returned after 2 failed deliveries
