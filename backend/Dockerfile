FROM node:20  
# → Version de NodeJs

WORKDIR /backend 
# → Défini le dossier où le code vivra dans le conteneur (c’est juste son nom ça peut être app)

COPY package*.json ./ 
# → copies uniquement les fichiers de dépendances.
# → Ça permet à Docker de mettre en cache l’installation des modules.

RUN npm install 
# → Installe les dépendances sur le conteneur, pas besoin d’installer nodejs sur notre machine

COPY . . 
# → On copie tout le backend

EXPOSE 3000 
# → Port d’exposition 3000 est la convention

CMD ["npm", "run", "dev"] 
# → Lance le serveur en mode développement
