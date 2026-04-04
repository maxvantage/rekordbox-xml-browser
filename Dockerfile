FROM node:20-alpine

WORKDIR /app

# Install server deps
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Install client deps and build
COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client/ ./client/
RUN cd client && npm run build

# Copy server source
COPY server/ ./server/

# The rekordbox.xml should be mounted or copied at runtime
# Default path: /app/rekordbox.xml
ENV XML_PATH=/app/rekordbox.xml
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/index.js"]
