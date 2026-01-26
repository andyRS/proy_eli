<?php
declare(strict_types=1);

function redirect_with_status(string $status, string $code): void
{
    $location = sprintf('Location: index.php?status=%s&code=%s', urlencode($status), urlencode($code));
    header($location, true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_with_status('error', 'invalid_method');
}

$nombre_usuario = trim((string) filter_input(INPUT_POST, 'nombre', FILTER_UNSAFE_RAW));
$email_usuario = trim((string) filter_input(INPUT_POST, 'email', FILTER_UNSAFE_RAW));
$consulta_usuario = trim((string) filter_input(INPUT_POST, 'mensaje', FILTER_UNSAFE_RAW));
$honeypot = trim((string) filter_input(INPUT_POST, 'website', FILTER_UNSAFE_RAW));

if ($honeypot !== '') {
    redirect_with_status('error', 'spam_detected');
}

$nombre_usuario = strip_tags($nombre_usuario);
$nombre_usuario = preg_replace('/\s+/', ' ', $nombre_usuario ?? '');
$email_usuario = filter_var($email_usuario, FILTER_SANITIZE_EMAIL);
$consulta_usuario = strip_tags($consulta_usuario);

if ($nombre_usuario === '' || $email_usuario === '' || $consulta_usuario === '') {
    redirect_with_status('error', 'missing_fields');
}

if (!preg_match('/^[\p{L}\s\'\.-]+$/u', $nombre_usuario)) {
    redirect_with_status('error', 'invalid_name');
}

if (!filter_var($email_usuario, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('error', 'invalid_email');
}

$nombre_length = mb_strlen($nombre_usuario);
$mensaje_length = mb_strlen($consulta_usuario);

if ($nombre_length < 2 || $nombre_length > 100) {
    redirect_with_status('error', 'invalid_name_length');
}

if ($mensaje_length < 10 || $mensaje_length > 1000) {
    redirect_with_status('error', 'invalid_message_length');
}

if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $consulta_usuario)) {
    redirect_with_status('error', 'invalid_message_content');
}

$destino = "elizabethmendezp18@gmail.com";
$asunto = "Consulta enviada desde www.dduhtylc.lucusvirtual.es/";

$mensaje = "El nombre del cliente es: " . $nombre_usuario . "\r\n";
$mensaje .= "Email del cliente es: " . $email_usuario . "\r\n";
$mensaje .= "Mensaje del cliente: " . $consulta_usuario . "\r\n";

$reply_to = str_replace(["\r", "\n"], '', $email_usuario);
$headers = [
    "From: jfkoyrib@hl110.lucushost.org",
    "Reply-To: " . $reply_to,
    "Content-Type: text/plain; charset=UTF-8",
];

$mail_sent = mail($destino, $asunto, $mensaje, implode("\r\n", $headers));

if (!$mail_sent) {
    redirect_with_status('error', 'send_failed');
}

redirect_with_status('success', 'sent');
?>
