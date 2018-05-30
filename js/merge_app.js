$(document).ready(function() {

    var stageW = window.innerWidth;

    var templateImageData;
    var templateFaceRect;
    var templateCanvas;

    initTemplateImage();

    document.getElementById("uploadDiv").style.display = "none";

    $('#uploadImage').bind('change', function(e) {
        var reader = new FileReader();
        var f = $(this).attr('files')[0];
        reader.onload = (function(theFile) {
            return function(e) {
                var image = new Image();
                image.onload = function() {
                    // uploadImage(image);
                    setTimeout(uploadImage, 100, image)
                }
                image.src = e.target.result;
            };
        })(f);
        reader.readAsDataURL(f);
    });



    function initTemplateImage() {
        var _w = 500;
        var _h = 742;
        var img = new Image();
        img.src = "./temp.jpg";

        setTimeout(function() {
            templateCanvas = document.createElement('canvas');
            document.body.appendChild(templateCanvas);
            templateCanvas.width = stageW;
            templateCanvas.height = stageW * _h / _w;

            var imgContext = templateCanvas.getContext("2d");
            imgContext.drawImage(img, 0, 0, stageW, stageW * _h / _w);

            var image = templateCanvas.toDataURL("image/png");
            templateImageData = image.substr(22); //去掉 data:image/png;base64,
            // document.body.removeChild(templateCanvas);

            getFaceRect(templateImageData, imgContext, function(faceRect) {
                addLog("模版完成 可以开始");
                templateFaceRect = faceRect;
                setTimeout(function() {
                    addLog(" 3~")
                }, 1000);
                setTimeout(function() {
                    addLog(" 2~")
                }, 2000);
                setTimeout(function() {
                    addLog(" 1~")
                }, 3000);
                setTimeout(function() {
                    document.getElementById("uploadDiv").style.display = "block";
                }, 3500);
            });

        }, 1000)

    }



    function uploadImage(_image) {
        var _w = _image.width;
        var _h = _image.height;


        var imgCanvas = document.createElement('canvas');
        imgCanvas.style.display = "block";
        imgCanvas.id = "imgCanvas";
        document.body.appendChild(imgCanvas);

        imgCanvas.width = stageW;
        imgCanvas.height = stageW * _h / _w;
        var imgContext = imgCanvas.getContext("2d");
        imgContext.drawImage(_image, 0, 0, stageW, stageW * _h / _w);

        //修复ios  
        if (navigator.userAgent.match(/iphone/i)) {
            console.log('iphone');

            var degree = 90 * Math.PI / 180;
            imgCanvas.width = stageW;
            imgCanvas.height = stageW * _w / _h;
            imgContext.rotate(degree);
            imgContext.drawImage(_image, 0, -stageW, stageW * _w / _h, stageW);
        }



        var image = imgCanvas.toDataURL("image/png");
        var imageData = image.substr(22); //去掉 data:image/png;base64,

        document.body.removeChild(imgCanvas);

        // return;
        getFaceRect(imageData, null, function(faceRect) {
            addLog("识别成功 等待融合..");
            addLog(faceRect);
            getMerge(imageData, faceRect, function(grayImg) {

                document.body.removeChild(templateCanvas);

                var img = document.createElement('img');
                img.setAttribute('src', grayImg);
                document.body.appendChild(img);

            });
        });
    }



    function getFaceRect(imageData, imgContext, call) {
        var apiKey = "DP3p0_hA7ri_cd5sexZryjPdr3Zsrkfd";
        var apiSecret = "1e1isj7MiWSv87sJ3I7iFV8Ow5WgnA6C";
        var url = "https://api-cn.faceplusplus.com/facepp/v3/detect";

        $.post(url, {
                api_key: apiKey,
                api_secret: apiSecret,
                image_base64: imageData
            },
            function(response) {
                var _json = JSON.parse(response);
                var _faceArr = _json.faces;
                var _faceRectangle = _faceArr[0].face_rectangle;

                // if (imgContext) {
                //     imgContext.fillStyle = "rgba(255,255,255,0.8)";
                //     imgContext.fillRect(_faceRectangle.left, _faceRectangle.top, _faceRectangle.width, _faceRectangle.height);
                // }

                var faceRect = _faceRectangle.top + ',' + _faceRectangle.left + ',' + _faceRectangle.width + ',' + _faceRectangle.height;
                call(faceRect);
            }
        );
    };


    function getMerge(imageData, faceRect, call) {
        var apiKey = "DP3p0_hA7ri_cd5sexZryjPdr3Zsrkfd";
        var apiSecret = "1e1isj7MiWSv87sJ3I7iFV8Ow5WgnA6C";
        var url = "https://api-cn.faceplusplus.com/imagepp/v1/mergeface";


        $.post(url, {
                api_key: apiKey,
                api_secret: apiSecret,
                template_base64: templateImageData,
                template_rectangle: templateFaceRect,
                merge_base64: imageData,
                merge_rectangle: faceRect,
                merge_rate: 50
            },
            function(response) {
                var _json = JSON.parse(response);
                var grayImg = 'data:image/jpeg;base64,' + _json.result;
                // addLog(_json);

                // var img = document.createElement('img');
                // img.setAttribute('src', grayImg);
                // document.body.appendChild(img);

                call(grayImg);
            }
        );
    };



    function addLog(data) {
        console.log(data);
        document.getElementById('log').innerHTML += JSON.stringify(data) + "<br>";
    }


});