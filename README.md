# 🚗 AutoManager

AutoManager est une application web de gestion de flotte automobile développée dans le cadre d'un projet DevOps.

Le projet simule le besoin de l'entreprise fictive **MecaDrive**, qui souhaite remplacer une gestion manuelle basée sur des fichiers et échanges dispersés par une application centralisée, sécurisée et déployée dans le cloud.

---

## 🎯 Objectifs du projet

AutoManager permet :

- de consulter les véhicules de la flotte ;
- de rechercher un véhicule ;
- de filtrer les véhicules selon leur statut ;
- d'ajouter un véhicule ;
- de modifier un véhicule ;
- de supprimer un véhicule ;
- de protéger les opérations d'administration ;
- de stocker les données dans PostgreSQL ;
- de déployer automatiquement le backend sur AWS ;
- de superviser l'application.

Les visiteurs disposent d'un accès en lecture seule.

Les opérations d'ajout, de modification et de suppression nécessitent une authentification administrateur.

---

## 🧱 Architecture

```text
Utilisateur
    │
    │ HTTPS
    ▼
Vercel
Next.js / React
    │
    │ API Routes Next.js
    ▼
AWS ECS Fargate
FastAPI / Python
Docker
Port 8000
    │
    │ PostgreSQL / 5432
    ▼
Amazon RDS
PostgreSQL privé