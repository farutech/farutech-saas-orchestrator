# Servicios de Email para .NET - Guía de Desarrollo y Producción

## 🎯 Servicios Recomendados

### 1. **Mailtrap (Para Desarrollo) + SendGrid (Para Producción)** ⭐⭐⭐⭐⭐
**Mejor opción híbrida para desarrollo → producción**

**Mailtrap (Desarrollo):**
- ✅ **Gratis**: 500 emails/mes
- ✅ **Inbox virtual**: Todos los emails van a un dashboard web
- ✅ **No llegan a spam**: Perfecto para testing
- ✅ **API SMTP**: Compatible con cualquier librería .NET
- ✅ **Templates**: Para probar emails HTML
- ✅ **Análisis**: Logs detallados de envío

**SendGrid (Producción):**
- ✅ **Migración fácil**: Mismo código, solo cambiar configuración
- ✅ **Escalabilidad**: Hasta millones de emails
- ✅ **Entrega garantizada**: 99.9% uptime
- ✅ **Analytics avanzado**: Métricas detalladas

**Configuración híbrida:**
```csharp
// appsettings.json
{
  "Email": {
    "Provider": "Mailtrap", // "SendGrid" en producción
    "Smtp": {
      "Host": "sandbox.smtp.mailtrap.io", // "smtp.sendgrid.net"
      "Port": 2525, // 587
      "Username": "your_username",
      "Password": "your_password"
    }
  }
}
```

### 2. **Mailgun** ⭐⭐⭐⭐
**Alternativa sólida a SendGrid**

**Ventajas:**
- ✅ **Gratis**: 5,000 emails/mes
- ✅ **API REST y SMTP**: Flexibilidad total
- ✅ **Dominios personalizados**: Mejor deliverability
- ✅ **Webhooks**: Para tracking avanzado
- ✅ **Templates**: Editor visual incluido

**Precios:**
- 5,000 emails gratis
- $35/mes por 50,000 emails
- $80/mes por 100,000 emails

### 3. **Postmark** ⭐⭐⭐⭐⭐
**Especializado en deliverability**

**Ventajas:**
- ✅ **Entrega garantizada**: 99.9% o te devuelven el dinero
- ✅ **API simple**: Solo 2 endpoints
- ✅ **Templates**: Sistema avanzado
- ✅ **Analytics**: Dashboard detallado
- ✅ **Soporte**: Excelente para developers

**Precios:**
- $10/mes por 10,000 emails
- $25/mes por 25,000 emails

### 4. **Amazon SES (Simple Email Service)** ⭐⭐⭐⭐
**Para proyectos en AWS**

**Ventajas:**
- ✅ **Muy barato**: $0.10 por 1,000 emails
- ✅ **Escalable**: Sin límites superiores
- ✅ **Integración AWS**: Fácil si usas otros servicios AWS
- ✅ **SMTP y API**: Ambas opciones

**Desventajas:**
- ❌ **Setup complejo**: Requiere configuración DNS
- ❌ **No gratis**: Sandbox limitado

### 5. **Mailjet** ⭐⭐⭐
**Buena opción europea**

**Ventajas:**
- ✅ **Gratis**: 6,000 emails/mes
- ✅ **API completa**: REST, SMTP, SDKs
- ✅ **Templates**: Editor drag-and-drop
- ✅ **GDPR compliant**: Para Europa

## 🚀 Implementación en .NET

### Librería Recomendada: **MailKit**
```bash
dotnet add package MailKit
```

### Servicio de Email Genérico
```csharp
using MailKit.Net.Smtp;
using MimeKit;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = false);
}

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        message.To.Add(new MailboxAddress("", to));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder();
        if (isHtml)
            bodyBuilder.HtmlBody = body;
        else
            bodyBuilder.TextBody = body;

        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_settings.Username, _settings.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
```

### Configuración por Ambiente
```csharp
// Program.cs
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("Email:Smtp"));

builder.Services.AddTransient<IEmailService, EmailService>();
```

### Settings por Ambiente
```json
// appsettings.Development.json
{
  "Email": {
    "Smtp": {
      "Host": "sandbox.smtp.mailtrap.io",
      "Port": 2525,
      "Username": "your_mailtrap_username",
      "Password": "your_mailtrap_password",
      "FromEmail": "noreply@yourapp.com",
      "FromName": "Your App"
    }
  }
}

// appsettings.Production.json
{
  "Email": {
    "Smtp": {
      "Host": "smtp.sendgrid.net",
      "Port": 587,
      "Username": "apikey",
      "Password": "your_sendgrid_api_key",
      "FromEmail": "noreply@yourapp.com",
      "FromName": "Your App"
    }
  }
}
```

## 📧 Servicios Gratuitos para Desarrollo

### 1. **Mailtrap** (Recomendado)
- **Gratis**: 500 emails/mes
- **URL**: https://mailtrap.io
- **Perfecto para**: Testing completo sin spam

### 2. **MailHog**
- **Gratis**: Auto-hosted
- **Instalación**: Docker o binario
- **Perfecto para**: Desarrollo local

### 3. **Papercut SMTP**
- **Gratis**: Desktop application
- **Perfecto para**: Desarrollo Windows

### 4. **smtp4dev**
- **Gratis**: Open source
- **Perfecto para**: .NET developers

## 🎯 Recomendación Final

### Para Tu Proyecto:
1. **Desarrollo**: **Mailtrap** (gratis, inbox virtual)
2. **Producción**: **SendGrid** o **Mailgun** (fácil migración)

### Por Qué Esta Combinación:
- ✅ **Mailtrap**: Emails no llegan a spam, fácil testing
- ✅ **SendGrid**: Escalable, confiable, buen precio
- ✅ **Migración**: Solo cambiar configuración, mismo código
- ✅ **Costos**: Desarrolllo gratis, producción pagas solo lo que usas

## 🚀 Próximos Pasos

1. **Crear cuenta en Mailtrap**: https://mailtrap.io
2. **Crear cuenta en SendGrid**: https://sendgrid.com
3. **Implementar EmailService** con MailKit
4. **Configurar settings** por ambiente
5. **Probar envío** de emails de registro/confirmación

¿Quieres que implemente el servicio de email en tu proyecto IAM?