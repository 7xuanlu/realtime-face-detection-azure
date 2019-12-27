# Realtime face detection implemented in Microsoft Azure Face

## Setup
First you can clone the repo
```git
git clone https://github.com/h164654156465/realtime-face-detection-azure.git
```

Once finished cloning the repo, install the required packages
```
npm install
```

Because we will call face api on Azure, you need to prepare your subscription key in .env file.
If you don't have .env in your current directory, plaese create one.

Your code in .env should look something like this:
```
FACE_SUBSCRIPTION_KEY=<your-subscription-key>
FACE_SUBSCRIPTION_REGION=<your-subscription-region>
```

## Test the application
Finally, run the application. You'll see an Express server created and listening on port 3000.
```
npm run start
```
Paste the below link to your browser, and the showcase would be up and running.
```
http://localhost:3000/index.html
```


## Reference
This work is inspired by https://github.com/CasparChou/Realtime-Demo-Page