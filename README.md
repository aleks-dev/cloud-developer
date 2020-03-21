# Aleks' version of Udacity's Cloud-Developer
---
This project is forked from the [Udacity's Cloud Developer Nanodegree one](https://github.com/udacity/cloud-developer).
It's my GitHub POW of my overall (high) engagement and learned skills in this course  :)


## Project structure
---
### Architectural structure
---
The project is divided into :
1. One frontend (client-side) web app
2. Two API (server-side) services
3. One reverse-proxy between the web app (1.) and its services (2.)
4. AWS S3 Bucket
5. AWS RDS relational-database

### GitHub structure
---
Project's GitHub structure follows the original one, as laid down by Udacity.


## Setup
---
There are **lots of things** to be set-up on your machine for this whole Project to run !
I will name here a _few most important GENERAL ones_ ONLY, for the **_Win 10_** platform :
- For more info on this, please subscribe to this great online course and follow it ;)
- For _more specific details_, please go to the _appropriate Course's README_ .

### Installations
---
**`NodeJS`**, **`NPM`**, **`Ionic`**, **`AWS CLI`**, **`Elastic Beanstalk CLI`**, **`Python 3+`**, **`Git`**, **`GitHub Desktop`**, **`VS Code`**, **`Postbird`**, **`Postman`**, **`Docker`**, **`EKSCTL`** ...

##### **Encryption**
---
It is **_required_** for the client-side authentication with **JWT Tokens** :
```
npm i bcrypt --save
npm i @types/bcrypt --save-dev
```

### Configurations
---
Again, _ONLY_ the most important / trickiest ones :

##### **AWS CLI**
---
Run `aws configure` from your _elevated (Admin-mode)_ command-prompt / PowerShell. Then just answer the questions ;)

##### **Elastic Beanstalk CLI**
---
1. `eb init`
2. manually edit the **config.yml** file _inside the ".elasticbeanstalk" folder_ in the main Root - add the **"deploy" entry**
3. add a _.npmrc_ file in the main Root and add **"unsafe-perm=true"** inside it
4. `npm run build`  (_with appropriate **package.json** script for the "build" command_)
5.  `eb create`
        - or if it's 2nd+ time
    `eb deploy`
6. Add the needed **Environment variables**

##### Docker Hub
---
Go to hub.docker.com and _**manually**_ create a new Repo there,
then:
```
1. docker tag [local_image_path]/[image_name][:version]  [docker_hub_username]/[docker_hub_repo_name][:version]
2. docker push [docker_hub_username]/[docker_hub_repo_name]
```

## Deployment
---
The project _should be deployed_ to the **AWS Cloud**. 
_Every course inside this project has specific deployment specs._
- For more info on the different deployment specs, please check the child READMEs under the separate Courses.

## Licence
---
Please feel free to use your forks on your own convenience, you `nerds` ;)

It's under an [MIT licence](https://choosealicense.com/licenses/mit/).
