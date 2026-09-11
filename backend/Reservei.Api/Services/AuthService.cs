using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Reservei.Api.DTOs.Auth;
using Reservei.Api.Exceptions;
using Reservei.Api.Models;
using Reservei.Api.Services.Interfaces;

namespace Reservei.Api.Services;

public class AuthService(
    UserManager<AppUser> userManager,
    ICurrentUserService currentUserService,
    IConfiguration config) : IAuthService
{
    public string GenerateToken(AppUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task CreateUserAsync(RegisterDto dto)
    {
        AppUser? userExists = await userManager.FindByEmailAsync(dto.Email);
        if (userExists is not null) throw new ValidationException("Esse email já está em uso.");

        var newUser = new AppUser
        {
            Email = dto.Email,
            UserName = dto.Email,
        };

        var result = await userManager.CreateAsync(newUser, dto.Password);

        if (!result.Succeeded)
        {
            var messages = string.Join(" | ", result.Errors.Select(e => e.Description));
            throw new ValidationException(messages);
        }
    }

    public async Task<string> LoginUserAsync(LoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        var validPassword = user is not null && await userManager.CheckPasswordAsync(user, dto.Password);

        if (!validPassword) throw new ValidationException("Email ou senha inválidos.");

        return GenerateToken(user!);
    }

    public async Task ChangeEmailAsync(ChangeEmailDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new ValidationException("Nenhum email para atualizar foi enviado.");

        AppUser? loggedUser = await userManager.FindByIdAsync(currentUserService.UserId);
        if (loggedUser is null) throw new UnauthenticatedException("Usuário não está logado");

        if (currentUserService.Email.Equals(dto.Email, StringComparison.OrdinalIgnoreCase))
            throw new ValidationException("Email não pode ser igual ao atual");

        AppUser? userExists = await userManager.FindByEmailAsync(dto.Email);
        if (userExists is not null) throw new ValidationException("Esse email já está em uso.");

        IdentityResult emailResult = await userManager.SetEmailAsync(loggedUser, dto.Email);

        if (!emailResult.Succeeded)
        {
            string errors = string.Join("; ", emailResult.Errors.Select(e => e.Description));
            throw new ValidationException($"Não foi possível atualizar o email: {errors}");
        }

        IdentityResult usernameResult = await userManager.SetUserNameAsync(loggedUser, dto.Email);

        if (!usernameResult.Succeeded)
        {
            string errors = string.Join("; ", usernameResult.Errors.Select(e => e.Description));
            throw new ValidationException($"Email atualizado, mas houve falha ao atualizar o nome de usuário: {errors}");
        }
    }

    public async Task ChangePasswordAsync(ChangePasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.NewPassword))
            throw new ValidationException("Necessário enviar a senha atual e a nova senha.");

        AppUser? loggedUser = await userManager.FindByIdAsync(currentUserService.UserId);
        if (loggedUser is null) throw new UnauthenticatedException("Usuário não está logado");

        IdentityResult result = await userManager.ChangePasswordAsync(loggedUser, dto.Password, dto.NewPassword);

        if (!result.Succeeded)
        {
            string errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new ValidationException($"Não foi possível alterar a senha: {errors}");
        }
    }
}
