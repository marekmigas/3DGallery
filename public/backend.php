<?php
/**
 * Created by PhpStorm.
 * User: marekmigas
 * Date: 28.06.16
 * Time: 11:12
 */
require '../vendor/autoload.php';
require '../src/config.php';

$app = new Slim\App(['settings' => $config]);

$container = $app->getContainer();
$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO("mysql:host=" . $db['host'] . ";dbname=" . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

require '../src/routes.php';

$app->run();
