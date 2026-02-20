# Docker

## Images

```bash
# Images
docker images # List images
docker build # Build an image
docker pull node:lts # Pull an image from remote
docker rmi node:lts # Remove Image
```

## Container

```bash
docker run -d image_name /bin/sh
docker ps -a
docker start container_name
docker stop container_name
docker restart container_name
docker exec -it container_name /bin/sh
```

## Logs

```bash
docker logs -f [container-id or container-name]
```

## System

```bash
docker system prune -a
docker status
```
