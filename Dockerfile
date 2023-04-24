# Base image
FROM node:18
# Create and Switch workdir
WORKDIR /app
# App source
COPY . /app
# Install dependencies
RUN ["npm","install"]
# Expose container port
EXPOSE 5000
# Entrypoint
ENTRYPOINT [ "npm", "run", "start:prod" ]