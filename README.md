# 🌐 Village by CA Laval — Showcase Website  
*A first‑year final project at Holberton School Laval*

## 📌 Overview  
This repository contains the showcase website developed for **Le Village by CA Laval**, a startup incubator located in Mayenne, France.  
The project was created as part of a **first‑year final assignment at Holberton School Laval**, with the objective of delivering a functional, deployable website that can be used directly by the Village by CA team.

The website highlights the incubator’s mission, activities, and ecosystem while offering an intuitive and modern user experience.

---

## 🎯 Project Goals  
The main purpose of this website is to provide **a clear and engaging digital presence** for Le Village by CA Laval.  
It aims to:

- Present the **latest news and updates** from the incubator  
- Explain the **support programs and services** offered to startups  
- Showcase the **partners** who contribute to the Village’s ecosystem  
- Highlight the **startups** that have joined the incubator  
- Provide a **contact form** allowing visitors to reach the Village’s manager directly  

---

## 🧩 Features  

### 🤝 Support & Programs  
A detailed presentation of the different types of guidance and resources offered to entrepreneurs.

### 🚀 Startups  
A directory of startups currently or previously incubated at the Village by CA Laval.

### 🏢 Partners  
A curated list of the Village’s partners.

### 📰 Blog Section  
A dynamic space dedicated to sharing news, events, and updates from the Village.

### 🗓️ Agenda  
A quarterly planning section presenting all upcoming events, workshops, meetings, and key moments organized by Le Village by CA Laval.

### 📬 Contact Form  
A direct communication channel allowing users to send messages to the Village’s manager.

---

## 🛠️ Technologies  

- HTML5 / CSS3 / JavaScript  
- React / Vite 
- Node.js & Express, MySQL & Prisma
- Docker

---

## 🔀 Branch Structure

We have several branches on this project, each with a different role:

- The main branch is the production branch; it's the validated version of the code from the Dev branch.
- The Dev branch is used to gather and merge the code from both developers. This allows us to identify conflicts and test the code as a whole before pushing it to the main production branch.

- The mai and guillaume branches are personal branches for code development.

---

## 📦 Installation  

#### Launch the application

To launch the website on your own computer, please fork this repository on your computer. Then, be sure that docker desktop is launched, then run :

```
docker compose up --build
```
The website will be available on port 5173 (frontend). The backend is running on port 3000. 

#### See the database

To look at the database with prisma studio, enter in the backend container terminal with this command :
```
docker exec -it backend bash
```
Then, execute this command in the terminal :
```
npx prisma studio
```
You can see the database within prisma studio on port 5555.
