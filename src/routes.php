<?php
/**
 * Created by PhpStorm.
 * User: marekmigas
 * Date: 28.06.16
 * Time: 11:13
 */


use Slim\Http\Request;
use Slim\Http\Response;

function loadRoom(PDO $db, $id)
{
    $stmt = $db->prepare("SELECT * FROM room_picture WHERE id_room_picture = :id");
    $stmt->bindValue(':id', $id);
    $stmt->execute();
    $result = $stmt->fetch();
    return $result;
}

//GET vytiahnutie vsetkych miestnosti z DB
$app->get('/roomPicture', function (Request $request, Response $response) {
    try {
        $stmt = $this->db->query("SELECT * FROM room_picture ");
        $ret = [];
        while ($roomPicture = $stmt->fetch()) {
            $ret[] = $roomPicture;
        }
        return $response->withJson($ret);
    } catch (PDOException $e) {
        return $response->withJson([
            'message' => $e->getMessage()
        ], 500);
    }
});

//DELETE mazanie miestnosti so zvolenym ID
$app->delete('/roomPicture/{id_room_picture}', function (Request $request, Response $response, $args) {
    if (empty($args['id_room_picture'])) {
        return $response->withStatus(404);
    }
    try {
        $stmt = $this->db->prepare("DELETE FROM room_picture WHERE id_room_picture = :id_room_picture");
        $stmt->bindValue(':id_room_picture', $args['id_room_picture']);
        $stmt->execute();
        return $response->withStatus(200);
    } catch (Exception $e) {
        return $response->withJson([
            'message' => $e->getMessage()
        ], 500);
    }
});


//POST vytvaranie novej miestnosti
$app->post('/roomPicture', function (Request $request, Response $response, $args) {
    try {
        $data = $request->getParsedBody();

        //Query na vytvorenie miestnosti (room_picture)
        $stmt = $this->db->prepare("INSERT INTO room_picture (name, description, num_picture) VALUES (:name, :desc, :num_picture)");
        $stmt->bindValue(":name", $data["name"]);
        $stmt->bindValue(":desc", $data["description"]);
        $stmt->bindValue(":num_picture", $data["num_picture"]);

        //Pridavanie obrazov do miestnosti podla poctu miest na obrazy v miestnosti
        if ($data['num_picture'] == '4') { //Ak su v miestnosti 4 obrazy
            $stmt2 = $this->db->prepare("INSERT INTO picture(name, width, height, image, room_picture_id_room_picture) VALUES (:name1, :width1, :height1, :image1, :room_id1), (:name2, :width2, :height2, :image2, :room_id2)");

        } elseif ($data['num_picture'] == '6') { //Ak je v miestnosti 6 obrazov
            $stmt2 = $this->db->prepare("INSERT INTO picture(name, width, height, image, room_picture_id_room_picture) VALUES (:name1, :width1, :height1, :image1, :room_id1), (:name2, :width2, :height2, :image2, :room_id2)");
        }

        if ($stmt->execute()) {
            $result = $this->db->lastInsertId();
            try {
                // IF v ktorom sa na zaklade poctu malieb v miestnosti binduju hodnoty k retazcom
                if ($data['num_picture'] == '4') {
                    for ($i = 1; $i <= 2; $i++) { // ; $i <= data['num_picture']   Pre testovanie nastaveny pocet iteracii na 2
                        $stmt2->bindValue(':name' . $i, $data['pic' . $i . '_name']);
                        $stmt2->bindValue(':width' . $i, $data['pic' . $i . '_width']);
                        $stmt2->bindValue(':height' . $i, $data['pic' . $i . '_height']);
                        $stmt2->bindValue(':image' . $i, $data['pic' . $i . '_image']);
                        $stmt2->bindValue(':room_id' . $i, $result);
                    }
                } elseif ($data['num_picture'] == '6') {
                    for ($i = 1; $i <= 2; $i++) { // ; $i <= data['num_picture']   Pre testovanie nastaveny pocet iteracii na 2
                        $stmt2->bindValue(':name' . $i, $data['pic' . $i . '_name']);
                        $stmt2->bindValue(':width' . $i, $data['pic' . $i . '_width']);
                        $stmt2->bindValue(':height' . $i, $data['pic' . $i . '_height']);
                        $stmt2->bindValue(':image' . $i, $data['pic' . $i . '_image']);
                        $stmt2->bindValue(':room_id' . $i, $result);
                    }
                }
                if ($stmt2->execute()) { // vykonavanie query na pridavanie obrazov k novovytvorenej miestnosti
                    return $response->withJson([
                        'success' => true,
                        'room' => loadRoom($this->db, $result),
                        'info' => 'Pictures added successfully'
                    ]);
                }
            } catch (PDOException $e) { // chyba pridavania obrazov do miestnosti
                return $response->withJson([
                    'message' => $e->getMessage(),
                    'error' => 'Error adding pictures'
                ]);
            }
            return $response->withJson([ // uspesne vytvorena miestnost aj pridane obrazy
                "success" => true,
                'info' => 'Room and pictures added'
            ]);
        } else {
            return $response->withStatus(500);
        }
    } catch (PDOException $e) { // chyba pri vytvarani miestnosti
        return $response->withJson([
            "message" => $e->getMessage(),
            'info' => 'Error creating room'
        ], 500);
    }
});

// TODO UPDATE !!!
// UPDATE miestnosti so zvolenym ID
// TODO vymysliet co spravit s 5. a 6. obrazom ak sa updatuje miestnost kde je 6 obrazov na miestnost so 4 obrazmi
$app->post('/roomPicture/{id_room_picture}', function (Request $request, Response $response, $args) {
    if (empty($args['id_room_picture'])) {
        return $response->withStatus(404);
    }
    try {
        $data = $request->getParsedBody();
        // update query
        $stmt = $this->db->prepare("UPDATE room_picture SET name=:name, description=:desc, num_picture=:num_picture WHERE id_room_picture=:id");
        $stmt->bindValue(':name', $data['name']);
        $stmt->bindValue(':desc', $data['description']);
        $stmt->bindValue(':num_picture', $data['num_picture']);
        $stmt->bindValue(':id', $args['id_room_picture']);
        if ($stmt->execute()) {

            return $response->withJson([
                'success' => true
            ]);
        } else {
            return $response->withStatus(500);
        }
    } catch (Exception $e) {
        return $response->withJson([
            'message' => $e->getMessage(),
            'info' => 'Unable to update'
        ], 500);
    }
});


// GET vytiahnutie miestnosti z DB so zadanym ID
$app->get('/roomPicture/RoomDetails/{id}', function (Request $request, Response $response, $args) {
    if (empty($args['id'])) {
        return $response->withStatus(404);
    }
    try {
        $stmt = $this->db->prepare("SELECT id_room_picture, num_picture, room_picture.name AS room_name, room_picture.description AS room_description, picture.id_picture, picture.name AS picture_name, picture.description AS picture_description, picture.width, picture.height, picture.image FROM room_picture JOIN picture ON(room_picture.id_room_picture = picture.room_picture_id_room_picture) WHERE id_room_picture=:id");
        $stmt->bindValue(':id', $args['id']);
        $stmt->execute();
        return $response->withJson($stmt->fetchAll());
    } catch (Exception $e) {
        return $response->withJson([
            'message' => $e->getMessage()
        ], 500);
    }
});