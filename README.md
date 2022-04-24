# Scheduler

## Requirement

- Redis database
- Mongo database

## Installation

```
yarn install
```

## Configuration

```.env ".env"
MONGODB_HOST=YOUR_MONGODB_HOST
MONGODB_PORT=YOUR_MONGODB_PORT
MONGODB_DATABASE=YOUR_MONGODB_DATABASE
MONGODB_USERNAME=YOUR_MONGODB_USERNAME
MONGODB_PASSWORD=YOUR_DATABASE_PASSWORD
```

```json "configs/queue.json"
{
  "queues": {
    "redis-queue": {
      "redis": {
        "host": "REDIS_HOST",
        "port": "REDIS_PORT",
        "db": "REDIS_DB_NUMBER"
      },
      // Examples
      "jobs": {
        "get-api-version": {
          "opts": { "removeOnComplete": 50, "removeOnFail": 50 }
        },
        "delay": {
          "opts": {
            "removeOnComplete": 10,
            "removeOnFail": 20
          }
        }
      }
    }
  },
  // Bull Options
  "opts": {
    "removeOnComplete": 100,
    "removeOnFail": 200
  }
}
```

## Start

```
yarn start
```
