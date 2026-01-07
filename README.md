# 📝 Task Manager Pro - Architecture Conteneurisée (PostgreSQL / Node.js / Nginx)

Ce dépôt contient une application de gestion de tâches (To-Do List) robuste, sécurisée par authentification JWT et entièrement conteneurisée. L'architecture repose sur un modèle multi-conteneurs permettant une séparation stricte des responsabilités.

**Dépôt distant :** [git@github.com:N-Baroukh/todo-list-docker.git](git@github.com:N-Baroukh/todo-list-docker.git)

---

## 🏗️ Schéma d'Architecture

L'application suit un modèle **3-Tier** (Présentation, Logique, Données) isolé dans un réseau virtuel Docker nommé `app_network`.

* **Frontend (Port 8080)** : Serveur Nginx servant l'interface utilisateur minimaliste.
* **Backend (Port 3000)** : API REST Node.js/Express traitant la logique métier.
* **Database (Port 5432 - Isolé)** : PostgreSQL pour le stockage persistant.
* **pgAdmin (Port 8081)** : Interface d'administration SQL pour la maintenance.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
* **Système** : Windows 10/11 (avec WSL2), macOS ou Linux.
* **Docker Engine** : Version 24.0.0+
* **Docker Compose** : Version 2.20.0+

Vérifiez les installations avec :

```bash
docker --version
docker compose version
```
---

## 🚀 Procédure de Déploiement

### 1. Installation

Clonez le projet et accédez au répertoire :

```bash
git clone git@github.com:N-Baroukh/todo-list-docker.git
cd todo-list-docker
```

### 2. Lancement

Pour construire les images personnalisées et démarrer la stack en arrière-plan :

```bash
docker-compose up -d --build
```

Vérifiez que tous les conteneurs sont en cours d'exécution :

```bash
docker compose ps
```
Verifiez les logs pour vous assurer que tout fonctionne correctement :

```bash
docker compose logs -f
```

**Note :** En cas d'erreur de cache Docker au build, utilisez :

```bash
docker compose up --build --no-cache -d
```

### 3. Accès aux Services

| Service | URL | Identifiants par défaut |
|---------|-----|------------------------|
| Application Web | http://localhost:8080 | À créer via "S'inscrire" |
| pgAdmin (BDD) | http://localhost:8081 | admin@admin.com / admin |

---

## 🛠️ Configuration Technique & Services

### Liste des conteneurs

* **db (postgres:15-alpine)** : Base de données relationnelle.
* **api (Dockerfile Node.js)** : Serveur backend sécurisé.
* **client (Dockerfile Nginx)** : Serveur frontend statique.
* **pgadmin (dpage/pgadmin4)** : Outil de gestion de base de données.

### Persistance et Réseaux

* **Volumes** : Un volume nommé `pg_data` est utilisé pour mapper `/var/lib/postgresql/data`. Cela garantit que les utilisateurs et les tâches ne sont pas supprimés lors d'un arrêt des conteneurs.
* **Réseaux** : Tous les services sont sur `app_network`. La base de données n'expose aucun port sur la machine hôte pour une sécurité maximale.

---

## 🔐 Fonctionnalités & API

L'application utilise des JSON Web Tokens (JWT) pour sécuriser les échanges.

### Authentification

* **POST /register** : Création de compte (Mot de passe haché via Bcrypt).
* **POST /login** : Authentification et récupération du Token.

### Gestion des tâches (CRUD protégé)

* **GET /tasks** : Liste des tâches de l'utilisateur connecté.
* **POST /tasks** : Ajout d'une tâche.
* **PATCH /tasks/:id** : Bascule du statut completed (barre la tâche au clic).
* **DELETE /tasks/:id** : Suppression définitive.

---

## 💡 Choix Techniques Principaux (Critères d'Évaluation)

* **Sécurité (Non-Root)** : Le backend utilise l'instruction `USER node` pour éviter l'exécution avec les privilèges root.
* **PostgreSQL & Sequelize** : Utilisation d'un SGBDR pour garantir l'intégrité des données via des relations SQL.
* **Healthchecks** : L'API attend que PostgreSQL réponde "Healthy" avant de démarrer, assurant la résilience de la stack.
* **Images optimisées** : Utilisation de versions slim et alpine pour réduire la taille des images et la surface d'attaque.

---

## 🛠️ Maintenance

* **Logs** : `docker compose logs -f api`
* **Arrêt** : `docker compose stop`
* **Nettoyage total** : `docker compose down -v` (Attention : supprime les données)

---
## 📖 Commandes Utiles

### Démarrer les services
```bash
docker-compose up -d
```
### Arrêter les services
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ supprime les données)
```bash
docker-compose down -v
```

### Voir les logs
```bash
docker-compose logs -f [service_name]
```

### Redémarrer un service
```bash
docker-compose restart [service_name]
```

### Reconstruire un service
```bash
docker-compose up -d --build [service_name]
```

### Voir l'état des services
```bash
docker-compose ps
```
---
## 🔒 Sécurité
Mesure de sécurité implémentées :
* Utilisation de JWT pour sécuriser les endpoints.
* Hachage des mots de passe avec Bcrypt.
* Base de données non exposée à l'extérieur du réseau Docker.
* Exécution des conteneurs avec des utilisateurs non-root.
* Images Docker optimisées pour minimiser les vulnérabilités.
* Healthchecks pour assurer la disponibilité des services critiques.

---
## 📄 Auteur
Noam Baroukh 