#!/bin/sh
echo "############### Deleting latest containers ###############"
docker compose -f docker-compose.yaml down
docker system prune -f
echo "############### Docker Build ###############"
docker compose -f docker-compose.yaml build
echo "############### Docker Run ###############"
docker compose -f docker-compose.yaml up -d