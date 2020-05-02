# GKE Redis

Sample redis app

## Getting reserved IP of Redis Instance

First of all we will get the reserved IP using `gcloud redis instances describe INSTANCE_ID --region=REGION`

```bash
$ gcloud redis instances describe nitish --region=us-central1

authorizedNetwork: projects/cloudorbit/global/networks/default
connectMode: DIRECT_PEERING
createTime: '2020-05-02T13:33:27.062227003Z'
currentLocationId: us-central1-c
displayName: Nitish-Demo
host: 10.78.66.67
locationId: us-central1-c
memorySizeGb: 1
name: projects/cloudorbit/locations/us-central1/instances/nitish
persistenceIamIdentity: serviceAccount:278912744342-compute@developer.gserviceaccount.com
port: 6379
redisVersion: REDIS_4_0
reservedIpRange: 10.78.66.64/29
state: READY
tier: BASIC
```

From above we oly want `reservedIpRange: 10.78.66.64/29`

## Replacing RESERVED_IP_RANGE with the reserved IP range of your instance

You can see this `TARGETS="10.78.66.64" ./install.sh` line is having reserved IP from the earlier step.

```
$ git clone https://github.com/bowei/k8s-custom-iptables.git
$ cd k8s-custom-iptables/
$ TARGETS="10.78.66.64" ./install.sh
$ cd ..
```

> If we get any error or waring you can ignore them

## Build docker image and push to Google repository 

```
$ git clone https://github.com/nitishk72/gke-redis
$ cd gke-redis
$ cp gke_deployment/Dockerfile .
$ export PROJECT_ID="$(gcloud config get-value project -q)"
$ docker build -t gcr.io/${PROJECT_ID}/random-app:v1 .
$ gcloud docker -- push gcr.io/${PROJECT_ID}/random-app:v1
```

### Kubernetes deployment

```
$ export REDISHOST_IP=10.78.66.67
$ kubectl create configmap redishost --from-literal=REDISHOST=${REDISHOST_IP}
$ kubectl get configmaps redishost -o yaml
$ kubectl apply -f gke_deployment/random-app.yaml
$ kubectl get service random-app

```

## Check Deployment
```
$ kubectl get service random-app

NAME         TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)        AGE
random-app   LoadBalancer   10.110.13.231   35.226.173.161   80:30378/TCP   60s

$ curl http://35.226.173.161
```