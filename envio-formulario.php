<?php
declare(strict_types=1);

/**
 * Formulario de contacto — Elizabeth Mendez
 * Seguridad: honeypot, rate limiting por IP, validación estricta.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function redirect_with_status(string $status, string $code): never
{
    header(
        sprintf('Location: index.php?status=%s&code=%s', urlencode($status), urlencode($code)),
        true,
        303
    );
    exit;
}

// ─── Método ─────────────────────────────────────────────────────────────────

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_with_status('error', 'invalid_method');
}

// ─── Rate limiting — máx. 5 envíos por IP cada 15 minutos ──────────────────

$ip        = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip_hash   = hash('sha256', $ip);                  // nunca almacenamos la IP en crudo
$rate_file = sys_get_temp_dir() . '/em_rl_' . $ip_hash . '.json';
$window    = 900;   // segundos (15 min)
$max_sends = 5;

$rate_data = ['count' => 0, 'first_send' => time()];

if (file_exists($rate_file)) {
    $raw = file_get_contents($rate_file);
    if ($raw !== false) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $rate_data = $decoded;
        }
    }
}

// Reiniciar ventana si ya expiró
if ((time() - $rate_data['first_send']) > $window) {
    $rate_data = ['count' => 0, 'first_send' => time()];
}

if ($rate_data['count'] >= $max_sends) {
    redirect_with_status('error', 'rate_limit');
}

// ─── Honeypot ────────────────────────────────────────────────────────────────

$honeypot = trim((string) filter_input(INPUT_POST, 'website', FILTER_UNSAFE_RAW));
if ($honeypot !== '') {
    redirect_with_status('error', 'spam_detected');
}

// ─── Recogida de campos ──────────────────────────────────────────────────────

$nombre_raw   = trim((string) filter_input(INPUT_POST, 'nombre',   FILTER_UNSAFE_RAW));
$email_raw    = trim((string) filter_input(INPUT_POST, 'email',    FILTER_UNSAFE_RAW));
$consulta_raw = trim((string) filter_input(INPUT_POST, 'mensaje',  FILTER_UNSAFE_RAW));
$servicio_raw = trim((string) filter_input(INPUT_POST, 'servicio', FILTER_UNSAFE_RAW));
$telefono_raw = trim((string) filter_input(INPUT_POST, 'telefono', FILTER_UNSAFE_RAW));

// ─── Sanitización ────────────────────────────────────────────────────────────

$nombre_usuario   = preg_replace('/\s+/', ' ', strip_tags($nombre_raw))   ?? '';
$email_usuario    = (string) filter_var($email_raw, FILTER_SANITIZE_EMAIL);
$consulta_usuario = strip_tags($consulta_raw);
$servicio_usuario = strip_tags($servicio_raw);
$telefono_usuario = preg_replace('/[^\d\+\(\)\-\s]/', '', $telefono_raw);

// ─── Validaciones ────────────────────────────────────────────────────────────

if ($nombre_usuario === '' || $email_usuario === '' || $consulta_usuario === '') {
    redirect_with_status('error', 'missing_fields');
}

if (!preg_match('/^[\p{L}\s\'\.\-]+$/u', $nombre_usuario)) {
    redirect_with_status('error', 'invalid_name');
}

if (!filter_var($email_usuario, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('error', 'invalid_email');
}

$nombre_length  = mb_strlen($nombre_usuario);
$mensaje_length = mb_strlen($consulta_usuario);

if ($nombre_length < 2 || $nombre_length > 100) {
    redirect_with_status('error', 'invalid_name_length');
}

if ($mensaje_length < 10 || $mensaje_length > 1000) {
    redirect_with_status('error', 'invalid_message_length');
}

// Rechazar caracteres de control (salvo \t, \n, \r)
if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $consulta_usuario)) {
    redirect_with_status('error', 'invalid_message_content');
}

$allowed_services = [
    'vestido-fiesta', 'evento-especial', 'diseno-personalizado',
    'textiles-hogar', 'ajustes', 'otro', '',
];
if (!in_array($servicio_usuario, $allowed_services, true)) {
    redirect_with_status('error', 'invalid_service');
}

// ─── Construcción del correo ─────────────────────────────────────────────────

$destino = 'elizabethmendezp18@gmail.com';
$asunto  = 'Nueva consulta desde elizabethmendez.com';

$servicio_label = $servicio_usuario !== '' ? $servicio_usuario : 'No especificado';
$telefono_label = $telefono_usuario  !== '' ? $telefono_usuario : 'No proporcionado';

$mensaje  = "═══════════════════════════════════\r\n";
$mensaje .= "  NUEVA CONSULTA — Elizabeth Mendez\r\n";
$mensaje .= "═══════════════════════════════════\r\n\r\n";
$mensaje .= "Nombre:   {$nombre_usuario}\r\n";
$mensaje .= "Email:    {$email_usuario}\r\n";
$mensaje .= "Teléfono: {$telefono_label}\r\n";
$mensaje .= "Servicio: {$servicio_label}\r\n\r\n";
$mensaje .= "Mensaje:\r\n{$consulta_usuario}\r\n\r\n";
$mensaje .= "───────────────────────────────────\r\n";
$mensaje .= "Enviado: " . date('d/m/Y H:i:s') . " (hora servidor)\r\n";

// Prevención de header injection
$reply_to = str_replace(["\r", "\n"], '', $email_usuario);

$headers = implode("\r\n", [
    'From: no-reply@elizabethmendez.com',
    'Reply-To: ' . $reply_to,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: ElizabethMendezForm/2.0',
]);

// ─── Envío ───────────────────────────────────────────────────────────────────

$mail_sent = mail($destino, $asunto, $mensaje, $headers);

if (!$mail_sent) {
    redirect_with_status('error', 'send_failed');
}

// ─── Actualizar rate limit ────────────────────────────────────────────────────

$rate_data['count']++;
file_put_contents($rate_file, json_encode($rate_data), LOCK_EX);

// ─── Éxito ───────────────────────────────────────────────────────────────────

redirect_with_status('success', 'sent');
