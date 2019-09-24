(function () {
  const SNATSHOT_MS = 800 //800

  // Replace <Subscription Key> with your valid subscription key.
  const faceSubscriptionKey = 'ecef8c0cf52f4db9a0082309db13de44';

  // Replace <location> with your applied region.
  const detect_UriBase = 'https://westus2.api.cognitive.microsoft.com/face/v1.0/detect';
  const params = {
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender'
  };
  const detect_uri = detect_UriBase + "?" + $.param(params);


  var time = Date.now()

  function faceApiCall(data, callback) {
    const sendTime = Date.now();

    fetch(detect_uri, {
      method: "POST",
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': faceSubscriptionKey
      },
      body: data
    }).then(function (r) {
      return r.json();
    }).then(function (response) {
      if (sendTime < time) {

        // console.log("Obsolete data ", sendTime, time)
        return
      }
      time = sendTime
      callback(response)
    }).catch(e => {
      console.log("Error", e)
    })
  }

  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 800;    // We will scale the photo width to this
  var height = 500;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var canvas2 = null;


  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    canvas2 = document.getElementById('canvas2');
    photo = document.getElementById('photo');

    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: { width: 1280, height: 720, mirror: false },
        audio: false
      },
      function (stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          video.srcObject = stream;
          // video.play();
          // video.src = vendorURL.createObjectURL(stream);
        }
        setTimeout(() => video.play(), 1000)
      },
      function (err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        if (isNaN(height)) {
          height = width / (4 / 3);
        }
        height = 500;

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas2.setAttribute('width', width);
        canvas2.setAttribute('height', height);

        streaming = true;
      }
    }, false);

    takepicture(analyzePicture)
    setInterval(() => {
      takepicture(analyzePicture)
    }, SNATSHOT_MS);

    clearphoto();
  }

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function clearRect(canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  function takepicture(callback) {
    if (width && height) {
      canvas2.width = width;
      canvas2.height = height;
      ctx = canvas2.getContext('2d');
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      return callback(dataURLtoBlob(canvas2.toDataURL('image/png')))

    } else {
      clearphoto();
    }
  }

  function renderFaceResults(results) {

    // Draw Bounding Box
    drawBoundingBox = (ctx, box) => {
      ctx.beginPath();
      ctx.lineWidth = box.borderWidth;
      ctx.strokeStyle = box.borderColor;
      ctx.rect(box.left, box.top, box.width, box.height);
      ctx.stroke();
      ctx.closePath();
    }

    // Draw Label
    drawLabel = (ctx, label) => {
      ctx.beginPath();
      ctx.font = label.textFontStyle
      ctx.fillStyle = label.textColor
      ctx.fillText(label.text, label.textLeft, label.textTop)
      ctx.closePath();
    }

    // Draw Label Rect
    drawLabelRect = (ctx, label) => {
      ctx.beginPath()
      ctx.fillStyle = label.rectColor
      ctx.rect(label.rectLeft, label.rectTop, label.rectWidth, label.rectHeight)
      ctx.fill()
      ctx.closePath()
    }

    conversion = (origin) => {
      return {
        left: origin.faceRectangle.left,
        top: origin.faceRectangle.top,
        width: origin.faceRectangle.width,
        height: origin.faceRectangle.height,
        age: origin.faceAttributes.age,
        gender: origin.faceAttributes.gender,
      }
    }


    results.forEach(each => {
      console.log(each)
        each['box'] = conversion(each)
        console.log(each.box)

        const ctx = canvas.getContext('2d')

        labelText = `${each.box.gender}, ${each.box.age}`

        const label = {
          text: labelText,
          textLeft: each.box.left + 5,
          textTop: each.box.top - 6,
          textColor: "white",
          textFontStyle: "16px Microsoft JhengHei UI",
          rectLeft: each.box.left - 1,
          rectTop: each.box.top - 22,
          rectWidth: labelText.length * 8 + 15, // [JhengHei Font] Each font size = 8
          rectHeight: 22,
          rectColor: "rgba(161, 230, 34, 0.8)"
        }

        const boundingBox = {
          left: each.box.left,
          top: each.box.top,
          width: each.box.width,
          height: each.box.height,
          borderColor: "rgba(161, 230, 34, 0.8)",
          borderWidth: "2"
        }

        drawBoundingBox(ctx, boundingBox)
        drawLabelRect(ctx, label)
        drawLabel(ctx, label)
      });
    //})
  }

  function analyzePicture(data) {
    faceApiCall(data, (results) => {
      if (results.length == 0) {
        console.log("no face detected");
        clearRect(canvas);
      } else {
        console.log("face detected");
        clearRect(canvas);
        renderFaceResults(results);
      }
      // identifyFaceAsync(results[0].faceId, (results1) => {
      //   if (results1[0].candidates.length == 0) {
      //     console.log("person id not exist")
      //     clearRect(canvas);
      //     renaderFaceResults(results, results1);
      //   }
      //   else {
      //     console.log("person id exist");
      //     getPersonAsync(results1[0].candidates[0].personId, (results2) => {
      //       clearRect(canvas);
      //       renaderFaceResults(results, results1, results2.name);
      //     })
      //   }
      // });
    });
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();
