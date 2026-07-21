using System;
using Microsoft.AspNetCore.Identity;

namespace Reservei.Api.Models;

public class AppUser : IdentityUser
{
    public string? FullName { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}