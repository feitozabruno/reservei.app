using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reservei.Api.DTOs.Auth;
using Reservei.Api.Models;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class AuthService(UserManager<AppUser> userManager) : IAuthService
{
    private readonly UserManager<AppUser> _userManager = userManager;

    public async Task CreateUserAsync(RegisterDto dto)
    {
        AppUser? userExists = await _userManager.FindByEmailAsync(dto.Email);
        if (userExists is not null) throw new Exception("Esse email já está em uso.");

        var newUser = new AppUser
        {
            FullName = dto.FullName,
            Email = dto.Email,
            UserName = dto.Email,
        };

        var result = await _userManager.CreateAsync(newUser, dto.Password);

        if (!result.Succeeded)
        {
            var messages = string.Join(" | ", result.Errors.Select(e => e.Description));
            Console.WriteLine(messages);
            throw new Exception($"Erro ao criar usuário: {messages}");
        }
    }
}
