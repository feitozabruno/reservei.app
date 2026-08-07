using System.Collections.Generic;

namespace Reservei.Api.Helpers;

public static class BrazilTimezoneMapper
{
    private static readonly Dictionary<string, string> UfToTimezone = new()
    {
        // UTC-03:00
        ["SP"] = "America/Sao_Paulo",
        ["RJ"] = "America/Sao_Paulo",
        ["MG"] = "America/Sao_Paulo",
        ["ES"] = "America/Sao_Paulo",
        ["PR"] = "America/Sao_Paulo",
        ["SC"] = "America/Sao_Paulo",
        ["RS"] = "America/Sao_Paulo",
        ["GO"] = "America/Sao_Paulo",
        ["DF"] = "America/Sao_Paulo",
        ["BA"] = "America/Sao_Paulo",
        ["SE"] = "America/Sao_Paulo",
        ["AL"] = "America/Sao_Paulo",
        ["PE"] = "America/Sao_Paulo",
        ["PB"] = "America/Sao_Paulo",
        ["RN"] = "America/Sao_Paulo",
        ["CE"] = "America/Sao_Paulo",
        ["PI"] = "America/Sao_Paulo",
        ["MA"] = "America/Sao_Paulo",
        ["TO"] = "America/Sao_Paulo",
        ["PA"] = "America/Sao_Paulo",

        // UTC-04:00
        ["MT"] = "America/Cuiaba",
        ["MS"] = "America/Campo_Grande",
        ["RO"] = "America/Porto_Velho",
        ["AM"] = "America/Manaus",
        ["RR"] = "America/Boa_Vista",

        // UTC-05:00
        ["AC"] = "America/Rio_Branco",
    };

    public static string GetTimezone(string uf) =>
        UfToTimezone.TryGetValue(uf.ToUpperInvariant(), out var tz)
            ? tz
            : "America/Sao_Paulo";
}