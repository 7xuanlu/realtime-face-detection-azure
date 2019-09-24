var time = Date.now()

function identifyFaceAsync(faceId, callback) {
    const sendTime = Date.now();
    console.log("in to identifyface function: " + faceId);
    fetch('https://westus2.api.cognitive.microsoft.com/face/v1.0/identify', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': 'ecef8c0cf52f4db9a0082309db13de44'
        },
        body: JSON.stringify({
            "PersonGroupId": "mstc-ai-readiness-20190731-test2",
            "faceIds": [
                faceId
            ],
            "confidenceThreshold": 0.5
        })
    })

        .then(function (r) {
            return r.json();
        })
        .then(function (response) {
            if (sendTime < time) {
                // console.log("Obsolete data ", sendTime, time)
                return;
            }
            time = sendTime
            callback(response)
        }).catch(e => {
            console.log("Error", e)
        })
}

function getPersonAsync(personId, callback) {
    const sendTime = Date.now();
    console.log("in to getperson function: " + personId);
     // Replace <location> with your applied region. Replace <name> with your specified name
    fetch('https://westus2.api.cognitive.microsoft.com/face/v1.0/persongroups/mstc-ai-readiness-20190702-test1/persons/' + personId, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            // Replace <Subscription Key> with your valid subscription key.
            'Ocp-Apim-Subscription-Key': 'ecef8c0cf52f4db9a0082309db13de44' 
        }
    })
        .then(function (r) {
            return r.json();
        })
        .then(function (response) {
            if (sendTime < time) {
                // console.log("Obsolete data ", sendTime, time)
                return;
            }
            time = sendTime
            callback(response)
        }).catch(e => {
            console.log("Error", e)
        })
}

