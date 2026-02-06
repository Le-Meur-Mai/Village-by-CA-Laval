# Village by C/A Website - Portfolio Project

We have several branches on this project, each with a different role:

- The main branch is the production branch; it's the validated version of the code from the Dev branch.
- The Dev branch is used to gather and merge the code from both developers. This allows us to identify conflicts and test the code as a whole before pushing it to the main production branch.

- The mai and guillaume branches are personal branches for code development.

## Launch the application

To launch the website on your own computer, be sure that docker desktop is launched, then run :

```
docker compose up --build
```
The website is available on port 3000 (backend) and 5173 (frontend). 

### See the database

To look at the database with prisma studio, enter in the backend container terminal with :
```
docker exec -it backend bash
```
Then, execute this command in the terminal :
```
npx prisma studio
```
You can see the database within prisma studio on port 5555.
