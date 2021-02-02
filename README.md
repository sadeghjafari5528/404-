# untitled-project
Analysis and design of systems Project Fall99

## Participants
* **Sadegh Jafari**
* **Abdollah Ebadi**
* **Parisa Zafari**
* **Zahra Salehi**
* **Mohammad Sajad Naghizadeh**

## Mentor
* **Hanie Haghshenas**

## Produsct Owner
* **Mohammad Sanaie Abbasi**

## Links
### Feasibility Study Phase
* **https://docs.google.com/document/d/171gEU-c90w6d5enHcLP_2gPhSjJv9YnS1cMy9Y0kBQY/edit?usp=sharing**

### Tasks
* **https://share.clickup.com/l/h/4-10749044-1/2461270d1112815**

## Requirements
* **node.js**
* **python**
* **pip**

## initializing 
### first downlaod or clone project and then open Project folder next:
```console
$ cd ./Front
$ npm install
$ cd ../Back
$ pip install -r requirements.txt
$ cd ./json-server-master
$ npm install -g json-server
```
### Run app
```console
$ cd ./Front
$ npm start
$ cd ../Back
$ python manage.py runserver
$ cd ./json-server-master
$ json-server --watch db.json --port 3004
```
