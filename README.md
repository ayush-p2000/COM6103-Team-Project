## **<span style="colour: #2E8B57">ePanda</span>** Device Recycling

### Setup
Setting up the application into a running state is easy to do and can be completed in a few steps.

First, the project must be cloned from the git repository using the command:

`git clone <repository.git url>`.

Once the project has been code, navigate into the top-level folder at the destination.

Inside this folder, there will be a folder titled www. The web application is located within this folder. The file path should be `<project root>/www/`. Navigate into this folder.

Next, you need to install the project dependencies. This can be carried out using Node Package Manager. Navigate using a command prompt to the above folder, and run the following command:

`npm install`

This will install all of the dependencies needed for the project.

The project is now ready to run. However, there is one step left before the application can be successfully started.

As this project makes use of some external APIs and services, including PayPal, Stripe, and MongoDB; as well as handling user information such as passwords, there is are a number of different credentials, secrets, and configuration options that need to be configured.

This is made simple through the use of a dotenv file. An example of this file can be found at the path `<project root>/www/.env.example`. Normally, you will need to create a copy of this file named .env at the same location. However, for the purposes of marking, a version of the dotenv file is attached to the final report that contains a pre-populated list of secrets so that you can connect to our existing database instance, and other services appropriately.

Once you have created a version of the .env file, the application is now ready to run. In order to run the application, the following command can be executed:

`npm run start`

This will start up the application in your terminal and will allow you to access the site at the URL `http://<BASE_URL>:<PORT>`, which will default to `http://localhost:3000`, unless reconfigured within the dotenv file.

If done correctly, you should be presented with the ePanda landing page.

To login, you may create accounts as stated in the user guide, however, some demonstrator accounts have been provided if using the demonstration environment:

A Standard User:
```
Username: user@test.com
Password: 00000000
```
An Admin Account:
```
Username: admin@test.com
Password: 00000000
```

**Please note:** The initial connection to the database can take a while, this is due to the passport handshake and database connections being established. This can cause the login page to stall for a moment or take a while to load or two on the first login.