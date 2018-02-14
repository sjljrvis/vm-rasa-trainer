

# Guide to use vm-rasa-trainer

> npm install


# use your digital-ocean api key and paste it in config.js


>  CLOUD=do FILE=/home/sejal/Downloads/testData.json node index.js;

    After running above command shell script is generated "deploy.sh" which user has to run explicitly

>  ./deploy.sh

SSH connection is established with VM where model is trained with MITIE models and mitie configs
After model is trained , complete package is dockerized and docker image pushed under user sjljarvis with timestamp as a tag


After model training is complete VM is deleted from cloud-provider.
