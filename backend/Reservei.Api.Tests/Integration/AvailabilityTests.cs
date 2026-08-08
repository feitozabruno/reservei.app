using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Reservei.Api.DTOs.Availability;
using Reservei.Api.Tests.Fixtures;

namespace Reservei.Api.Tests.Integration;

public class AvailabilityTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly AuthHelper _auth;

    public AvailabilityTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _auth = new AuthHelper(_client);
    }

    [Fact]
    public async Task Create_WithValidData_ReturnCreated()
    {
        var profile = await _auth.CreateProfessional();

        var dto = new List<CreateAvailabilityDto>()
        {
            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Monday,
                StartTime = new TimeOnly(9, 0, 0),
                EndTime = new TimeOnly(13, 0, 0)
            },

            new CreateAvailabilityDto {
                DayOfWeek = DayOfWeek.Monday,
                StartTime = new TimeOnly(15, 0, 0),
                EndTime = new TimeOnly(19, 0, 0)
            },
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/availabilities")
        {
            Content = JsonContent.Create(dto)
        };
        request.Headers.Add("Cookie", profile.User.Token);

        var response = await _client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        body.Should().Be("Disponibilidade criada com sucesso.");

        var request2 = new HttpRequestMessage(HttpMethod.Get, "/api/availabilities/me");
        request2.Headers.Add("Cookie", profile.User.Token);
        var response2 = await _client.SendAsync(request2);
        var body2 = await response2.Content.ReadFromJsonAsync<IEnumerable<AvailabilityResponseDto>>();

        var expected = new List<AvailabilityResponseDto>
        {
            new() {
                Id = (Guid)(body2?.First().Id)!,
                ProfessionalId = profile.Professional.Id,
                DayOfWeek = DayOfWeek.Monday,
                StartTime = new TimeOnly(9, 0, 0),
                EndTime = new TimeOnly(13, 0, 0)
            },
            new() {
                Id = (Guid)(body2?.Last().Id)!,
                ProfessionalId = profile.Professional.Id,
                DayOfWeek = DayOfWeek.Monday,
                StartTime = new TimeOnly(15, 0, 0),
                EndTime = new TimeOnly(19, 0, 0)
            }
        };
        body2.Should().BeEquivalentTo(expected);
    }
}