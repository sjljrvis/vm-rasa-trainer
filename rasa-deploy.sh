#!/bin/sh

echo "Setting up environment ----->"


sudo apt-get install git
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
sudo apt-get install -y python-pip

echo "Cloning rasa-nlu ----->"
git clone https://github.com/RasaHQ/rasa_nlu
cd rasa_nlu
pip install -r requirements.txt
pip install -e .

echo "Setting up Mitie Backend----->"

pip install git+https://github.com/mit-nlp/MITIE.git
pip install rasa_nlu[mitie]

echo "Downloading Mitie Models----->"

cd
wget https://github.com/mit-nlp/MITIE/releases/download/v0.4/MITIE-models-v0.2.tar.bz2
tar -xjvf MITIE-models-v0.2.tar.bz2

cd rasa_nlu

cp /root/demo-rasa.json /root/rasa_nlu/data/examples/rasa/demo-rasa.json
cp /root/MITIE-models/english/total_word_feature_extractor.dat /root/rasa_nlu/data

python -m rasa_nlu.train -c sample_configs/config_mitie.json



cp /root/rasa_nlu/docker/Dockerfile_mitie /root/rasa_nlu/Dockerfile

sudo docker login --username <username> --password <password>

DATE_WITH_TIME=`date "+%H%M%S"`
docker build -t <dockerUserName>/$DATE_WITH_TIME .
docker push <dockerUserName>/$DATE_WITH_TIME
echo '-----------------------------------'
echo docker pull <dockerUserName>/$DATE_WITH_TIME
echo '-----------------------------------'