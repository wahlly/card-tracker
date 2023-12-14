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

Now, the server should be live on port 3000

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
- card is generated from our end
- card is picked up by courier partner
- card is delivered
- if card could not be delivered, re-delivery is attempted maximum of two times, after which it is returned.

The sample datasets folder in csv format, used to communicate with the courier partner is stored under the `data` folder. I iterated through the csv datasets and rearranged them in another list according to the top-level flow. I iterated through the files, starting from `pickup` csv file, if it has been picked up, then i move on to check if it has been delivered, after which i can return the status as delivered, else if it has not been delivered, then i have to check if it has failed twice so i can check the `returned` file for if the card has been returned. If at the end of the iteration, the card has no logs in any of the files, the initial status `awaiting_pickup` will be sent, which tells that, the card has been created but yet to be picked up by the courier partner. Below are the status definitions used and their meaning;
- `awaiting_pickup` ->  a newly created card yet to be picked up
- `on_delivery` -> card has been picked by the courier
- `delivered` -> card has been delivered
- `failed_delivery` -> card delivery failed, and is to be re-delivered
- `returned` -> card has been returned after 2 failed deliveries

I achieved this using expressjs, a nodejs framework, which i leveraged on the fs (file-system) and stream module of nodejs.

For easy distribution, I containerized the application, with the database used to create and store the generated cards.
I could not include enough validations in the app (especially when generating a new card) due to time constraints, as i needed to focus on the more important part of the task.