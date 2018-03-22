$(document).ready(function() {

    init();


    function init() {
        $('#upload').bind('change', function(e) {
            var reader = new FileReader();
            var f = $(this).attr('files')[0];
            reader.onload = (function(theFile) {
                return function(e) {
                    var image = new Image();
                    image.onload = function() {
                        uploadImage(image);
                        //setTimeout(uploadImage,100,image)
                    }
                    image.src = e.target.result;
                };
            })(f);
            reader.readAsDataURL(f);
        });
    }



    function uploadImage(_image) {
        var _w = _image.width;
        var _h = _image.height;

        var imgCanvas = document.createElement('canvas');
        imgCanvas.style.display = "block";
        imgCanvas.id = "imgCanvas";
        document.body.appendChild(imgCanvas);
        imgCanvas.width = _w;
        imgCanvas.height = _h;

        var imgContext = imgCanvas.getContext("2d");

        var _scale = (window.innerWidth / _w) * 0.8;

        imgContext.drawImage(_image, 0, 0, _w, _h, 0, 0, _w * _scale, _h * _scale);


        var image = imgCanvas.toDataURL("image/png");
        var imageData = image.substr(22); //去掉 data:image/png;base64,

        // document.body.removeChild(imgCanvas);

        //return;
        // getFace(imageData, imgContext);
        getBody(imageData, imgCanvas, imgContext);
    }


    function getFace(imageData, imgContext) {
        var apiKey = "DP3p0_hA7ri_cd5sexZryjPdr3Zsrkfd";
        var apiSecret = "1e1isj7MiWSv87sJ3I7iFV8Ow5WgnA6C";
        var url = "https://api-cn.faceplusplus.com/facepp/v3/detect";

        $.post(url, {
                api_key: apiKey,
                api_secret: apiSecret,
                image_base64: imageData,
                return_attributes: "gender,age,smiling,emotion,ethnicity,beauty,skinstatus"
            },
            function(response) {
                var _json = JSON.parse(response);
                var _faceArr = _json.faces;
                var _faceRectangle = _faceArr[0].face_rectangle;
                addLog(_faceArr[0].attributes);

                imgContext.fillStyle = "rgba(0,0,0,0.5)";
                imgContext.fillRect(_faceRectangle.left, _faceRectangle.top, _faceRectangle.width, _faceRectangle.height);

            }
        );
    };

    function getBody(imageData, imgCanvas, imgContext) {
        var apiKey = "DP3p0_hA7ri_cd5sexZryjPdr3Zsrkfd";
        var apiSecret = "1e1isj7MiWSv87sJ3I7iFV8Ow5WgnA6C";
        var url = "https://api-cn.faceplusplus.com/humanbodypp/beta/segment";

        $.post(url, {
                api_key: apiKey,
                api_secret: apiSecret,
                image_base64: imageData
            },
            function(response) {
                var _json = JSON.parse(response);
                var grayImg = 'data:image/jpeg;base64,' + _json.result;
                addLog(_json);


                var img = document.createElement('img');
                // img.setAttribute('style', 'display:none;');
                img.setAttribute('src', grayImg);
                document.body.appendChild(img);


                // imgContext.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
                // imgContext.drawImage(img, 0, 0);

                // var canvas = document.createElement("canvas");
                // document.body.appendChild(canvas);
                // canvas.width = imgCanvas.width;
                // canvas.height = imgCanvas.height;
                // var ctx = canvas.getContext("2d");
                // ctx.drawImage(img, 0, 0);

                // var canvasData = ctx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
                // var imgCanvasData = imgContext.getImageData(0, 0, imgCanvas.width, imgCanvas.height);

                // for (var x = 0; x < canvasData.width; x++) {
                //     for (var y = 0; y < canvasData.height; y++) {
                //         // Index of the pixel in the array
                //         var idx = (x + y * canvasData.width) * 4;
                //         var r = canvasData.data[idx + 0];
                //         var g = canvasData.data[idx + 1];
                //         var b = canvasData.data[idx + 2];
                //         if (r < 30 || g < 30 || b < 30) {

                //             // imgCanvasData.data[idx + 3] = 0; // Alpha channel
                //         }else{
                //             // console.log(r);
                //         }
                //     }
                // }

                // imgContext.putImageData(imgCanvasData, 0, 0);

            }
        );
    };




    function addLog(data) {
        console.log(data);
        document.getElementById('log').innerHTML = JSON.stringify(data) + "<br>";
    }

});