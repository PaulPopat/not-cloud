#!/bin/bash

not_cloud_version="NOT_CLOUD_VERSION"
file_store_location=""
if [ -d "/etc/not-cloud" ]; then
  file_store_location=$(< /etc/not-cloud/file-store-location.txt)
else
  mkdir /etc/not-cloud
  read -p "No config detected. Where would you like to store your files? " file_store_location
  echo $file_store_location >> /etc/not-cloud/file-store-location.txt
fi

cat > /etc/not-cloud/docker-compose.yml << EOL
version: "3.9"
services:
  web:
    image: paulpopat/not-cloud:${not_cloud_version}
    ports:
      - "3000:3000"
    command: ["node_modules/.bin/next", "start"]
    restart: unless-stopped
    volumes:
      - ${file_store_location}:/file-store
  db:
    image: postgres
    environment:
      POSTGRES_USER: not_cloud
      POSTGRES_PASSWORD: password
    ports:
      - "8001:5432"
    restart: unless-stopped
EOL

cwd=$(pwd)

{
  cd /etc/not-cloud
  docker-compose up -d --build
} || {
  cd $cwd
}

cd $cwd