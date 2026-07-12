#!/bin/bash

# Charge les variables du .env
# On va voir dans le .env, on ignore les lignes qui commencent par #
# On converti chaque ligne en arguments utilisables (variables)
export $(grep -v '^#' .env | xargs)

# --- CONFIG ---
CONTAINER_NAME="mysql"
MYSQL_USER="root"
MYSQL_PASSWORD="$MYSQL_ROOT_PASSWORD"
BACKUP_DIR="./backups"

echo "=== Restore MySQL Backup ==="

# Vérifie que le dossier backups existe
if [ ! -d "$BACKUP_DIR" ]; then
  echo "Le dossier $BACKUP_DIR n'existe pas."
  exit 1
fi

# Liste les fichiers disponibles
# Liste les fichiers 1 par ligne, liste seulement les fichiers gz
# 2>/dev/null cache les erreurs si aucun fichier gz n'existe
echo "Backups disponibles :"
ls -1 $BACKUP_DIR/*.gz 2>/dev/null

# Demande le nom du fichier, -p -> Affiche l'argument avant de lire la donnée rentrée
# Elle est stockée dans la variable FILE
echo ""
read -p "Entrez le nom du fichier à restaurer (sans le chemin) : " FILE

FULL_PATH="$BACKUP_DIR/$FILE"

# Vérifie que le fichier existe
if [ ! -f "$FULL_PATH" ]; then
  echo "Le fichier $FULL_PATH n'existe pas."
  exit 1
fi

echo ""
echo "ATTENTION : Cela va écraser la base de données actuelle."
read -p "Confirmer la restauration ? (oui/non) : " CONFIRM

if [ "$CONFIRM" != "oui" ]; then
  echo "Restauration annulée."
  exit 0
fi

echo ""
echo "Restauration en cours..."

# Exécute la restauration
# gunzip décompresse le fichier mis en entrée, à la sortie docker le récupère
# Ouvre un terminal interactif pour avoir les données en entrée dans le conteneur de la DB
# mysql va lire le fichier (un fichier en SQL) et va recréer la DB automatiquement
docker exec $CONTAINER_NAME mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"
gunzip < "$FULL_PATH" | docker exec -i $CONTAINER_NAME mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"

echo ""
echo "Restauration terminée avec succès."
