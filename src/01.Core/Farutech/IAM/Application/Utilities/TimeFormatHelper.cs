namespace Farutech.IAM.Application.Utilities;

/// <summary>
/// Helper para formatear tiempos de segundos a formato legible
/// </summary>
public static class TimeFormatHelper
{
    /// <summary>
    /// Convierte segundos a formato legible (Xd Xh Xm Xs)
    /// </summary>
    /// <param name="totalSeconds">Total de segundos</param>
    /// <returns>String formateado mostrando días, horas, minutos y segundos</returns>
    public static string FormatSecondsToReadable(int totalSeconds)
    {
        if (totalSeconds <= 0)
            return "0 segundos";

        var timeSpan = TimeSpan.FromSeconds(totalSeconds);
        
        var parts = new List<string>();

        if (timeSpan.Days > 0)
            parts.Add($"{timeSpan.Days} {(timeSpan.Days == 1 ? "día" : "días")}");

        if (timeSpan.Hours > 0)
            parts.Add($"{timeSpan.Hours} {(timeSpan.Hours == 1 ? "hora" : "horas")}");

        if (timeSpan.Minutes > 0)
            parts.Add($"{timeSpan.Minutes} {(timeSpan.Minutes == 1 ? "minuto" : "minutos")}");

        if (timeSpan.Seconds > 0)
            parts.Add($"{timeSpan.Seconds} {(timeSpan.Seconds == 1 ? "segundo" : "segundos")}");

        return string.Join(", ", parts);
    }

    /// <summary>
    /// Convierte segundos a formato corto (Xd Xh Xm Xs)
    /// </summary>
    public static string FormatSecondsToShort(int totalSeconds)
    {
        if (totalSeconds <= 0)
            return "0s";

        var timeSpan = TimeSpan.FromSeconds(totalSeconds);
        
        var parts = new List<string>();

        if (timeSpan.Days > 0)
            parts.Add($"{timeSpan.Days}d");

        if (timeSpan.Hours > 0)
            parts.Add($"{timeSpan.Hours}h");

        if (timeSpan.Minutes > 0)
            parts.Add($"{timeSpan.Minutes}m");

        if (timeSpan.Seconds > 0)
            parts.Add($"{timeSpan.Seconds}s");

        return string.Join(" ", parts);
    }

    /// <summary>
    /// Calcula tiempo restante hasta una fecha
    /// </summary>
    public static string GetTimeRemaining(DateTime expirationDate)
    {
        var remaining = expirationDate - DateTime.UtcNow;
        
        if (remaining.TotalSeconds <= 0)
            return "Expirado";

        return FormatSecondsToReadable((int)remaining.TotalSeconds);
    }
}
