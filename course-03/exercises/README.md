# Docker setup instructions
---

## Push your Docker images to your ***Docker Hub repo***
---
`docker push [docker_hub_username]/[docker_hub_repo_name]`

## Build and run a Docker image
---
```
1. docker build -t [relative_Github_FULL_path_to_your_project]  .
2. docker run --publish 8080:8080 --env POSTGRESS_HOST=$POSTGRESS_HOST --env POSTGRESS_USERNAME=$POSTGRESS_USERNAME --env POSTGRESS_PASSWORD=$POSTGRESS_PASSWORD --env POSTGRESS_DATABASE=$POSTGRESS_DATABASE --env AWS_REGION=$AWS_REGION --env AWS_PROFILE=$AWS_PROFILE --env AWS_MEDIA_BUCKET=$AWS_MEDIA_BUCKET --env JWT_TOKEN=$JWT_TOKEN --name user [relative_Github_FULL_path_to_your_project]
```
- if "invalid ELF header" after running, check this out https://medium.com/@devontem/solved-invalid-elf-header-with-docker-and-bcrypt-444426d63605


## Docker Compose
---
Use Docker Compose to **build, push and run** a _group of related containers_
- in this case, the whole current version of the application built-up from _4 different containers_
```
1. Build the images: `docker-compose -f docker-compose-build.yaml build --parallel`
2. Push the images: `docker-compose -f docker-compose-build.yaml push`
3. Run the container: `docker-compose up`
```


# Kubernetes setup instructions
---
This is a detailed guide for setting-up your **Win 10** machine and configuring your AWS EKS (Kubernetes) in the Cloud.
It is _based on my experience combined with this Course's instructions_, which may differ from yours.


## AWS EKS
---
Install it from [here](https://aws.amazon.com/eks/) .


## EKSCTL
---
Install it from [here](https://github.com/weaveworks/eksctl) .


### EKS
---
_First_, create the EKS cluster in the Cloud
1. eksctl create cluster

_then_ configure your local EKSCTL tool to work with it
2. aws eks --region eu-west-1 update-kubeconfig --name cluster_name


### Local Udagram project
This is the list of steps I needed to _first configure_ and _then run_ in AWS my **refactored-to-microservices** Udagram project

_First_, **encode in base64** the values inside your 2 "secret" files (this is a _**Powershell script**_)
```1. 
    $fileContentBytes = [System.Text.Encoding]::UTF8.GetBytes('your_value')
    $fileContentEncoded = [System.Convert]::ToBase64String($fileContentBytes)
    $fileContentEncoded
```
_then_ apply the 2 "secret" files and 1 "config" file to the newly created EKS cluster
```
2. kubectl apply -f aws-secret.yaml
3. kubectl apply -f env-secret.yaml
4. kubectl apply -f env-config.yaml
```

_then_ apply the _**Deployments**_ and _**Services**_
```
5. kubectl apply -f backend-feed-deployment.yaml
6. kubectl apply -f backend-user-deployment.yaml
7. kubectl apply -f frontend-deployment.yaml
8. kubectl apply -f backend-feed-service.yaml
9. kubectl apply -f backend-user-service.yaml
10. kubectl apply -f frontend-service.yaml
```

_the **Reverse-Proxy** comes at the end_
`11. kubectl apply -f reverseproxy-deployment.yaml`

_finally_ port-forward your localhost to the deployed EKS service in the Cloud
```12. kubectl port-forward SERVICE/[NAME_OF_SVC] [local_port]:[cloud_port]
- for ex. kubectl port-forward SERVICE/frontend 8100:8100
```
... and try to call `localhost:8100` _from your browser_ .