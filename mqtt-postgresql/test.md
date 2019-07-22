# Use Docker & cf push application to Wise-Paas

This article will tell you how to use python to build a backend application 、use Docker save this application to a image and push it to Wise-Paas by Cloud Foundry(cf)。

## STEP 1:Prepare Environment

we need to install Docker 、Python3 and cf(cloud foundry)

Python3
[**Download Python**
*The official home of the Python Programming Language*www.python.org](https://www.python.org/downloads/)

Docker
[**Enterprise Container Platform | Docker**
*Build, Share, and Run Any App, Anywhere. Learn about the only enterprise-ready container platform to cost-effectively…*www.docker.com](https://www.docker.com/)

cf-cli
[**Installing the cf CLI | Cloud Foundry Docs**
*Configuring your Cloud Foundry for BOSH Backup and Restore*docs.cloudfoundry.org](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

![](https://cdn-images-1.medium.com/max/2000/1*ZoBmgGEHJkSrJaX2NSNspQ.png)

## STEP 2:Build Our Application

Now we want to create python backend use flask，if you have pip use pip3 install flask 。

    mkdir try_docker_python
    cd try_docker_python

Add a file name hello.py。

<iframe src="https://medium.com/media/15a05052c2ca10f16882989ae9a610e6" frameborder=0></iframe>

Add a file name requirements.txt，this file save what module we want to import

<iframe src="https://medium.com/media/72efa10481588c26fb0ef5e7cfc9ee61" frameborder=0></iframe>

Add a “Dockerfile”，this file use to build our docker image

<iframe src="https://medium.com/media/081df27430fb92011f355a27efcc1ae0" frameborder=0></iframe>

## Step 3:Build our image and push it to docker hub

Now，Let’s use command to build our docker image。

    **~/try_docker_python>** docker build -t try_docker_python .

and we go to docker hub to create new repository
[**Docker Hub**
*Edit description*hub.docker.com](https://hub.docker.com/)

![](https://cdn-images-1.medium.com/max/2000/1*KYhJr-gx14IbGe-qoeApPA.png)

You can name by yourself，and this time i name try_docker_python。

![](https://cdn-images-1.medium.com/max/2000/1*2rwTcMIdXSh3kT_Dtwtb6A.png)

and we push our local image to docker hub。

* “docker tag” let our image belong to docker hub repository。

* “docker push” push it to docker hub repository

    **~/try_docker_python>** docker tag try_docker_python tsian077/try_docker_python
    **~/try_docker_python>** docker push tsian077/try_docker_python

## Step 4:Use cf push docker image to Wise-Paas

Now，we need to login to Wise-Paas/EnSaaS，

[https://portal-technical.wise-paas.com/doc/document-portal.html#Guide-1](https://portal-technical.wise-paas.com/doc/document-portal.html#Guide-1)

![](https://cdn-images-1.medium.com/max/2276/1*Sh2pe6z6cnJPQ6QW1B8sKw.png)

Now，we need to login to the Wise-Paas，so we type those in terminal

    **~/try_docker_python>** cf login –skip-ssl-validation -a api.wise-paas.io -u xxx@advantech.com.tw -p password

![](https://cdn-images-1.medium.com/max/2000/1*Ob3UnoOr8q_aYQ1Xbjx70w.png)

“-a” is your domain name，because i use the Wise-Paas，my domain name is **“wise-paas.io”**，and you need to add **“api”** in front of it ，-u and -p is your account and password。

![](https://cdn-images-1.medium.com/max/2000/1*t49ZEQ5thu8evJAkEMfCMw.png)

and you can chek it state use

    **~/try_docker_python> **cf target

if it work now we can push our application to the Wise-Paas。

(cf push “application_name” --docker-image “youraccount/yourreposity -m 125m -k 256m”)

    **~/try_docker_python> **cf push cf_docker_python --docker-image tsian077/try_docker_python -m 125m -k 256m

* — docker-image:this is the docker-image which we push to the docker hub

* -m :The memory we give to our application

* -k :The disk we give to our application