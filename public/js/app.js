/**
 * Created by marekmigas on 28.06.16.
 */
var GalleryApp = angular.module('GalleryApp', ['GalleryAppControllers', 'ngRoute']);

GalleryApp.constant('apiURL', 'roomPicture');

GalleryApp.run(['$rootScope', function ($rootScope) {
    $rootScope.roomPictures = [];
}]);

var GalleryAppControllers = angular.module('GalleryAppControllers', ['ngRoute']);

GalleryAppControllers.controller('RoomsCtrl', function ($http, $rootScope, $scope, apiURL, $q) {
    console.log('RoomsCtrl');

    // zobrazenie formularu na vytvorenie miestnosti
    $scope.showCreateForm = function () {
        console.log('showCreateForm');
        $('#modal-room-title').text('Create new Room');
        $('#btn-update-room').hide();
        $('#btn-create-product').show();

        $scope.id_room_picture = '';
        $scope.name = "";
        $scope.description = "";
//TODO ng-scr sa neprepisuje na default.png ... src sa prepise
        $scope.image1 = "";
        $scope.pic1_height = "";
        $scope.pic1_width = "";
        $scope.pic1_name = "";
        $scope.file_txt1 = "";
        $scope.pic1_image = "default.png";
        document.getElementById('pic1_preview').setAttribute('src', 'default.png');

        $scope.image2 = "";
        $scope.pic2_height = "";
        $scope.pic2_width = "";
        $scope.pic2_name = "";
        $scope.file_txt2 = "";
        $scope.pic2_image = "default.png";
        document.getElementById('pic2_preview').setAttribute('src', 'default.png');

        $scope.image3 = "";
        $scope.pic3_height = "";
        $scope.pic3_width = "";
        $scope.pic3_name = "";
        $scope.file_txt3 = "";
        $scope.pic3_image = "default.png";
        document.getElementById('pic3_preview').setAttribute('src', 'default.png');

        $scope.image4 = "";
        $scope.pic4_height = "";
        $scope.pic4_width = "";
        $scope.pic4_name = "";
        $scope.file_txt4 = "";
        $scope.pic4_image = "default.png";
        document.getElementById('pic4_preview').setAttribute('src', 'default.png');

        $scope.image6 = "";
        $scope.pic6_height = "";
        $scope.pic6_width = "";
        $scope.pic6_name = "";
        $scope.file_txt6 = "";
        $scope.pic6_image = "default.png";
        document.getElementById('pic5_preview').setAttribute('src', 'default.png');

        $scope.image5 = "";
        $scope.pic5_height = "";
        $scope.pic5_width = "";
        $scope.pic5_name = "";
        $scope.file_txt5 = "";
        $scope.pic5_image = "default.png";
        document.getElementById('pic5_preview').setAttribute('src', 'default.png');
    };


    //zobrazenie miestnosti na editovanie
    $scope.showOne = function (id) {
        console.log('ShowOne ' + id);
        $http.get(apiURL + '/RoomDetails/' + id)
            .success(function (data) {
                $scope.id_room_picture = id;
                $scope.name = data[0].room_name;
                $scope.description = data[0].room_description;
                $scope.paintings = data[0].num_picture;

                //for (var i = 0; i <= 1; i++) {
                $scope.pic1_id = data[0].id_picture;
                $scope.pic1_name = data[0].picture_name;
                $scope.pic1_width = Number(data[0].width);
                $scope.pic1_height = Number(data[0].height);
                $scope.pic1_image = data[0].image;
                $scope.pic1_description = data[0].picture_description;

                $scope.pic2_id = data[1].id_picture;
                $scope.pic2_name = data[1].picture_name;
                $scope.pic2_width = Number(data[1].width);
                $scope.pic2_height = Number(data[1].height);
                $scope.pic2_image = data[1].image;
                $scope.pic2_description = data[1].picture_description;
                // }
            });
        $('#modal-room-title').text('Details/Edit Room');
        $('#modal-room-form').openModal();
        $('#btn-create-product').hide();

    };

    // GET na vytiahnutie vsetkych miestnosti z DB
    $http.get(apiURL)
        .success(function (data) {
            $rootScope.roomPictures = data;
        });

    $scope.getAllRooms = function () {
        $http.get(apiURL)
            .success(function (data) {
                $rootScope.roomPictures = data;
            });
    };

    // defaultny stav radio
    $scope.paintings = 4;

    // POST vytvorenie novej miestnosti
    $scope.addRoom = function () {
        var results = [];
        // var inputs = pole inputov, zatial su tu koli testovaniu len 2
        var inputs = [document.getElementById('form-image1'), document.getElementById('form-image2')];
        var inputCount;
        var filesLoaded = 0;
        console.log("addRoom");
        // TODO pridat kontrolu na vsetky inputy okrem 'description' -> ta moze byt null
        if ($scope.name) {
            inputCount = Number(inputs.length);
            for (var i = 0; i < inputCount; i++) {
                if (inputs[i].files && inputs[i].files[0]) {
                    var FR = new FileReader(); // FileReader na prevod IMG do Base64
                    FR.onload = function (event) {
                        results.push(event.target.result); // pridavanie vysledkov do pola
                        filesLoaded++;
                        if (filesLoaded == inputCount) {
                            $http.post(apiURL, {
                                name: $scope.name,
                                description: $scope.description,
                                num_picture: Number($scope.paintings),

                                pic1_name: $scope.pic1_name,
                                pic1_width: $scope.pic1_width,
                                pic1_height: $scope.pic1_height,
                                pic1_image: results[0],

                                pic2_name: $scope.pic2_name,
                                pic2_width: $scope.pic2_width,
                                pic2_height: $scope.pic2_height,
                                pic2_image: results[1],

                                pic3_name: $scope.pic3_name,
                                pic3_width: $scope.pic3_width,
                                pic3_height: $scope.pic3_height,
                                pic3_image: results[2],

                                pic4_name: $scope.pic4_name,
                                pic4_width: $scope.pic4_width,
                                pic4_height: $scope.pic4_height,
                                pic4_image: results[3],

                                pic5_name: $scope.pic5_name,
                                pic5_width: $scope.pic5_width,
                                pic5_height: $scope.pic5_height,
                                pic5_image: results[4],

                                pic6_name: $scope.pic6_name,
                                pic6_width: $scope.pic6_width,
                                pic6_height: $scope.pic6_height,
                                pic6_image: results[5]

                            }).success(function (data) {
                                $rootScope.roomPictures.push(data.room); // pridanie novej miestnosti do zoznamu
                                // vycistenie inputov TODO vycistit vsetky inputy
                                $scope.name = "";
                                $scope.description = "";
                                $scope.paintings = "4";

                                $scope.image1 = "";
                                $scope.pic1_height = "";
                                $scope.pic1_width = "";
                                $scope.pic1_name = "";
                                $scope.pic1_image = "default.png";
                                document.getElementById('pic1_preview').setAttribute('src', 'default.png');

                                $scope.image2 = "";
                                $scope.pic2_height = "";
                                $scope.pic2_width = "";
                                $scope.pic2_name = "";
                                $scope.pic2_image = "default.png";
                                document.getElementById('pic2_preview').setAttribute('src', 'default.png');

                                Materialize.toast('Room created');
                                $('#modal-room-form').closeModal();
                            }).error(function (data) {

                                console.log(data.message);
                                Materialize.toast('Error');
                            });
                        }
                    };
                    FR.readAsDataURL(inputs[i].files[0]);
                }
            }

        } else {
            // TODO alert alebo Toast (??) ktory informuje o tom ze musia byt vyplnene vsetky polia (okrem desc)
            alert("You must enter at least name of the room!");
        }
    };

    // POST update zvolenej miestnosti
    $scope.updateRoom = function () {
        console.log('Updating room...');
        if ($scope.name) {
            $http.post(apiURL + '/' + $scope.id_room_picture, {
                id: $scope.id_room_picture,
                name: $scope.name,
                description: $scope.description,
                num_picture: $scope.paintings,

                pic1_name: $scope.pic1_name,
                pic1_width: $scope.pic1_width,
                pic1_height: $scope.pic1_height,
                pic1_image: $scope.pic1_image

            }).success(function (data) {
                Materialize.toast('Room has been updated', 4000);
                $scope.getAllRooms();
                $('#modal-room-form').closeModal();
            }).error(function (data) {
                console.log(data.message);
                Materialize.toast('Error updating room', 4000);
            });
        }
    };

    // DELETE miestnosti
    $scope.deleteRoom = function (room) {
        $http.delete(apiURL + '/' + room.id_room_picture)
            .success(function (data) {
                var i = $rootScope.roomPictures.indexOf(room);
                if (i != -1) {
                    $rootScope.roomPictures.splice(i, 1);
                }
                Materialize.toast('Room has been deleted successfully', 4000);
            }).error(function (data) {
            console.log(data.message);
            Materialize.toast('Error deleting room', 4000);
        });
    };

});

/* ---- jQuery ---- */

// Inicializacia Modal elementu od Materialized css
$(document).ready(function () {
    $('.modal-trigger').leanModal();
    $('select').material_select();

    // Obsluha radio-buttonov
    $('input:radio[name=group1]').change(function () {
        if (this.value == '4') { // ak uzivatel vyberie 4 tak sa 5. a 6. input schova
            console.log('Four paintings');
            $('#fifthImage').fadeOut(500);
            $('#sixthImage').fadeOut(500);
        }
        else if (this.value == '6') { // ak uzivatel vyberie 6 tak sa 5. a 6. input znova objavi
            console.log('Six paintings');
            $('#fifthImage').fadeIn(2000);
            $('#sixthImage').fadeIn(2000);
        }
    });

    // Metoda sluziaca na tvorbu 'preview' obrazu ktory chce uzivatel nahrat
    function readURL(input, id_input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                writeTo = id_input.substr(10, 1);
                // pridanie base64 img do ng-src koli pristupu z angularu
                $('#pic' + writeTo + '_preview').attr('ng-src', '{{' + e.target.result + '}}');
                // pridanie base64 img do src aby mal uzival k dispozicii nahlad
                $('#pic' + writeTo + '_preview').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }


    $("#form-image1").change(function () {
        readURL(document.getElementById('form-image1'), 'form-image1');
    });
    $("#form-image2").change(function () {
        readURL(document.getElementById('form-image2'), 'form-image2');
    });
    $("#form-image3").change(function () {
        readURL(document.getElementById('form-image3'), 'form-image3');
    });
    $("#form-image4").change(function () {
        readURL(document.getElementById('form-image4'), 'form-image4');
    });
    $("#form-image5").change(function () {
        readURL(document.getElementById('form-image5'), 'form-image5');
    });
    $("#form-image6").change(function () {
        readURL(document.getElementById('form-image6'), 'form-image6');
    });

});
