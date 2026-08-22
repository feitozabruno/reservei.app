using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Reservei.Api.DTOs.Appointment;
using Reservei.Api.DTOs.Availability;
using Reservei.Api.DTOs.Service;
using Reservei.Api.Models;
using Reservei.Api.Tests.Fixtures;

namespace Reservei.Api.Tests.Integration;

public class AppointmentTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly AuthHelper _auth;

    public AppointmentTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _auth = new AuthHelper(_client);
    }

    [Fact]
    public async Task Create_WithValidData_ReturnCreated()
    {
        var profile = await _auth.CreateProfessionalWithServicesAndAvailability();
        var professional = await _client.GetFromJsonAsync<Professional>($"/api/professionals/{profile.Professional.Username}");

        static DateTime NextMonday()
        {
            DateTime now = DateTime.Now;
            var dayOfWeek = now.DayOfWeek;

            return dayOfWeek switch
            {
                DayOfWeek.Monday => now.AddDays(7),
                DayOfWeek.Tuesday => now.AddDays(6),
                DayOfWeek.Wednesday => now.AddDays(5),
                DayOfWeek.Thursday => now.AddDays(4),
                DayOfWeek.Friday => now.AddDays(3),
                DayOfWeek.Saturday => now.AddDays(2),
                DayOfWeek.Sunday => now.AddDays(1),
                _ => now.AddDays(0),
            };
        }

        var targetDate = NextMonday().ToString("yyyy/MM/dd");

        var availableSlots = await _client.GetFromJsonAsync<List<DateTimeOffset>>($"/api/professionals/{professional!.Id}/available-slots?serviceId={professional.Services.First().Id}&date={targetDate}");

        var dto = new CreateAppointmentDto
        {
            ProfessionalId = professional.Id,
            ServiceId = professional.Services.First().Id,
            ClientName = "Testador",
            ClientEmail = "test@email.com",
            ClientPhone = "12345678910",
            StartTime = availableSlots!.First()
        };

        var response = await _client.PostAsJsonAsync("/api/appointments", dto);
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var body = await response.Content.ReadFromJsonAsync<Appointment>();
        body!.ProfessionalId.Should().Be(professional.Id);
        body!.ServiceId.Should().Be(professional.Services.First().Id);
        body!.StartTime.Should().Be(availableSlots!.First());
    }
}