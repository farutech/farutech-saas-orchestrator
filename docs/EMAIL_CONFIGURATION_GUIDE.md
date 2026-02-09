# Guía de Configuración de Email

El servicio de email soporta dos modos de transporte: **SMTP** y **API**.

## 🔧 Configuración en appsettings.json

### Opción 1: Mailtrap API (Recomendado para producción)

```json
{
  "EmailOptions": {
    "Transport": "Api",
    "Provider": "Mailtrap",
    "Enabled": true,
    "FromEmail": "hello@mailtest.farutech.com",
    "FromName": "Farutech IAM",
    "Api": {
      "Url": "https://send.api.mailtrap.io/api/send",
      "ApiToken": "YOUR_MAILTRAP_API_TOKEN",
      "TimeoutSeconds": 30
    }
  }
}
```

**Cómo obtener tu API Token de Mailtrap:**
1. Ingresa a [Mailtrap.io](https://mailtrap.io)
2. Ve a **Email Sending** → **Domains**
3. Copia tu **API Token**

### Opción 2: Mailtrap SMTP

```json
{
  "EmailOptions": {
    "Transport": "Smtp",
    "Provider": "Mailtrap",
    "Enabled": true,
    "FromEmail": "hello@mailtest.farutech.com",
    "FromName": "Farutech IAM",
    "Smtp": {
      "Host": "live.smtp.mailtrap.io",
      "Port": 587,
      "Username": "api",
      "Password": "YOUR_MAILTRAP_API_TOKEN",
      "EnableSsl": true,
      "TimeoutSeconds": 30
    }
  }
}
```

### Opción 3: Mailtrap Sandbox (Solo desarrollo)

```json
{
  "EmailOptions": {
    "Transport": "Smtp",
    "Provider": "Mailtrap",
    "Enabled": true,
    "FromEmail": "test@example.com",
    "FromName": "Farutech Test",
    "Smtp": {
      "Host": "sandbox.smtp.mailtrap.io",
      "Port": 2525,
      "Username": "YOUR_SANDBOX_USERNAME",
      "Password": "YOUR_SANDBOX_PASSWORD",
      "EnableSsl": true,
      "TimeoutSeconds": 30
    }
  }
}
```

### Opción 4: SendGrid API

```json
{
  "EmailOptions": {
    "Transport": "Api",
    "Provider": "SendGrid",
    "Enabled": true,
    "FromEmail": "noreply@farutech.com",
    "FromName": "Farutech",
    "Api": {
      "Url": "https://api.sendgrid.com/v3/mail/send",
      "ApiToken": "YOUR_SENDGRID_API_KEY",
      "TimeoutSeconds": 30
    }
  }
}
```

### Opción 5: SMTP Genérico (Gmail, Outlook, etc.)

```json
{
  "EmailOptions": {
    "Transport": "Smtp",
    "Provider": "Gmail",
    "Enabled": true,
    "FromEmail": "your-email@gmail.com",
    "FromName": "Farutech",
    "Smtp": {
      "Host": "smtp.gmail.com",
      "Port": 587,
      "Username": "your-email@gmail.com",
      "Password": "your-app-password",
      "EnableSsl": true,
      "TimeoutSeconds": 30
    }
  }
}
```

## 📧 Templates Parametrizables

Los templates usan la sintaxis `${variable}` para reemplazar valores dinámicamente.

### Variables disponibles por template:

**Email Confirmation:**
- `${userName}` - Nombre del usuario
- `${confirmationUrl}` - URL de confirmación
- `${currentYear}` - Año actual

**Password Reset:**
- `${userName}` - Nombre del usuario
- `${resetUrl}` - URL para reset
- `${currentYear}` - Año actual

**Password Changed:**
- `${userName}` - Nombre del usuario
- `${currentYear}` - Año actual

**Welcome Email:**
- `${userName}` - Nombre del usuario
- `${currentYear}` - Año actual

**Security Alert:**
- `${userName}` - Nombre del usuario
- `${alertMessage}` - Mensaje de alerta
- `${ipAddress}` - IP desde donde ocurrió el evento
- `${currentYear}` - Año actual

## 🧪 Testing

### Deshabilitar envío de emails (desarrollo):

```json
{
  "EmailOptions": {
    "Enabled": false,
    "Transport": "Smtp",
    "Provider": "Mailtrap"
  }
}
```

Cuando `Enabled: false`, los emails se loguean pero no se envían.

## 🔄 Cambio entre API y SMTP

Solo cambia el valor de `Transport`:

```json
{
  "EmailOptions": {
    "Transport": "Api",  // o "Smtp"
    // ... resto de configuración
  }
}
```

## ✅ Ejemplo de curl para Mailtrap API

```bash
curl --location --request POST \
'https://send.api.mailtrap.io/api/send' \
--header 'Authorization: Bearer YOUR_API_TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
  "from": {
    "email": "hello@mailtest.farutech.com",
    "name": "Farutech Test"
  },
  "to": [{
    "email": "test@example.com"
  }],
  "subject": "Test Email",
  "text": "This is a test",
  "html": "<h1>This is a test</h1>"
}'
```

## ⚙️ Registro en Program.cs

```csharp
// Configure email options
builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection(EmailOptions.SectionName));

// Register email service
builder.Services.AddHttpClient(); // Required for API transport
builder.Services.AddTransient<IEmailService, EmailService>();
```

## 🚨 Troubleshooting

**Error: "API token is required"**
- Verifica que `EmailOptions:Api:ApiToken` esté configurado en appsettings.json

**Error: "Authentication failed"**
- Para SMTP: Verifica Username y Password
- Para API: Verifica que el ApiToken sea válido

**Emails no llegan:**
- Verifica `Enabled: true`
- Revisa logs para ver errores de envío
- Para Mailtrap sandbox, verifica la bandeja en mailtrap.io

**Templates no reemplazan variables:**
- Verifica que uses la sintaxis `${variable}` (no `{{variable}}`)
- Asegúrate de pasar el diccionario correcto con las variables
