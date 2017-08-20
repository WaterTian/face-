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

        var _scale = (window.innerWidth/_w) *0.8;

        imgContext.drawImage(_image, 0, 0, _w, _h, 0, 0, _w*_scale, _h*_scale);


        var image = imgCanvas.toDataURL("image/png");
        var imageData = image.substr(22); //去掉 data:image/png;base64,

        // document.body.removeChild(imgCanvas);

        //return;
        PostImage(imageData, imgContext)
    }


    function PostImage(imageData, imgContext) {
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
                addLog(_json);
                addLog(_faceRectangle);

                imgContext.fillStyle = "rgba(0,0,0,0.5)";
                imgContext.fillRect(_faceRectangle.left, _faceRectangle.top, _faceRectangle.width, _faceRectangle.height);

            }
        );
    };


    function addLog(data) {
        console.log(data);
        document.getElementById('log').innerHTML = JSON.stringify(data) + "<br>";
    }

});