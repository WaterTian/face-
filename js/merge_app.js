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

        initTemplateImage();
    }

    function initTemplateImage()
    {
        var _w = 500;
        var _h = 500;
        var img = new Image();
        img.src = "temp.jpg";
        document.body.appendChild(img);

        // var imgCanvas = document.createElement('canvas');
        // document.body.appendChild(imgCanvas);
        // imgCanvas.width = _w;
        // imgCanvas.height = _h;

        // var imgContext = imgCanvas.getContext("2d");
        // var _scale = (window.innerWidth / _w) * 0.8;

        // imgContext.drawImage(img, 0, 0, _w, _h, 0, 0, _w * _scale, _h * _scale);


        // var image = imgCanvas.toDataURL("image/png");
        // var imageData = image.substr(22); //去掉 data:image/png;base64,

        // document.body.removeChild(imgCanvas);
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

        document.body.removeChild(imgCanvas);

        //return;
        getMerge(imageData);
    }


    function getMerge(imageData) {
        var apiKey = "DP3p0_hA7ri_cd5sexZryjPdr3Zsrkfd";
        var apiSecret = "1e1isj7MiWSv87sJ3I7iFV8Ow5WgnA6C";
        var url = "https://api-cn.faceplusplus.com/imagepp/v1/mergeface";


        $.post(url, {
                api_key: apiKey,
                api_secret: apiSecret,
                template_url: "http://h5n.180china.com/lab/temp.jpg",
                template_rectangle:"110,140,224,280",
                merge_base64: imageData,
                merge_rectangle:"110,140,224,280",
                merge_rate:60
            },
            function(response) {
                var _json = JSON.parse(response);
                var grayImg = 'data:image/jpeg;base64,' + _json.result;
                addLog(_json);


                var img = document.createElement('img');
                img.setAttribute('src', grayImg);
                document.body.appendChild(img);


            }
        );
    };




    function addLog(data) {
        console.log(data);
        document.getElementById('log').innerHTML = JSON.stringify(data) + "<br>";
    }

});