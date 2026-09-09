using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using Reservei.Api.Models;

namespace Reservei.Api.Data;

public static class DatabaseSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Professionals.Any()) return;

        // ---------------------------------------------------------
        // 1. GERAR USUÁRIOS (O Mínimo Viável para o Identity não dar erro no banco)
        // ---------------------------------------------------------
        var userFaker = new Faker<AppUser>("pt_BR")
            .RuleFor(u => u.Id, f => Guid.NewGuid().ToString())
            .RuleFor(u => u.Email, f => f.Internet.Email().ToLower())

            // Replicamos o E-mail para os campos que o banco de dados exige
            .RuleFor(u => u.UserName, (f, u) => u.Email)
            .RuleFor(u => u.NormalizedEmail, (f, u) => u.Email!.ToUpper())
            .RuleFor(u => u.NormalizedUserName, (f, u) => u.Email!.ToUpper())

            .RuleFor(u => u.PasswordHash, "SenhaTeste123")
            .RuleFor(u => u.CreatedAt, f => f.Date.PastOffset(1));

        var fakeUsers = userFaker.Generate(50);
        db.Users.AddRange(fakeUsers);

        // ---------------------------------------------------------
        // 2. GERAR OS PROFISSIONAIS
        // ---------------------------------------------------------
        // Lista de especialidades comuns para deixar os dados realistas
        var specialties = new[] { "Psicólogo", "Programador", "Barbeiro", "Cabeleireiro", "Manicure", "Esteticista", "Maquiador", "Tatuador", "Massoterapeuta" };
        int userIndex = 0;

        var professionalFaker = new Faker<Professional>("pt_BR")
            .RuleFor(p => p.Id, f => Guid.NewGuid())

            // Simula que o profissional foi criado através de um sistema de identidade (como o Identity)
            .RuleFor(p => p.UserId, f => fakeUsers[userIndex++].Id)

            .RuleFor(p => p.FullName, f => f.Name.FullName())
            .RuleFor(p => p.Username, (f, p) => f.Internet.UserName(p.FullName).ToLower().Replace(".", ""))

            .RuleFor(p => p.Specialty, f => f.PickRandom(specialties))

            // "BusinessName" ex: "João da Silva Beauty", "Barbearia do João"
            .RuleFor(p => p.BusinessName, (f, p) => $"{p.FullName.Split(' ')[0]} {f.Company.CompanySuffix()}")

            // Telefone padrão BR (Celular)
            .RuleFor(p => p.PhoneNumber, f => f.Phone.PhoneNumber("(##) 9####-####"))

            .RuleFor(p => p.Bio, f => f.Lorem.Paragraph(1))

            // Imagens aleatórias
            .RuleFor(p => p.AvatarUrl, f => f.Internet.Avatar())
            .RuleFor(p => p.BannerUrl, f => f.Image.PicsumUrl(1200, 400))

            // Endereço (O Bogus "pt_BR" tem suporte para dados do Brasil)
            .RuleFor(p => p.AddressCep, f => f.Address.ZipCode("########")) // Formato sem traço
            .RuleFor(p => p.AddressStreet, f => f.Address.StreetName())
            .RuleFor(p => p.AddressNumber, f => f.Address.BuildingNumber())
            .RuleFor(p => p.AddressNeightborhood, f => f.Address.SecondaryAddress())
            .RuleFor(p => p.AddressCity, f => f.Address.City())
            .RuleFor(p => p.AddressState, f => f.Address.StateAbbr()) // Sigla (SP, RJ, etc)

            // 30% de chance de ter complemento, senão fica nulo/vazio
            .RuleFor(p => p.AddressComplement, f => f.Random.Bool(0.3f) ? "Apto " + f.Random.Number(1, 100) : string.Empty)

            // Fuso horário padrão do Brasil
            .RuleFor(p => p.Timezone, "America/Sao_Paulo");

        // Gera 50 registros na memória
        var fakeProfessionals = professionalFaker.Generate(50);

        // Insere tudo no banco de uma vez só
        db.Professionals.AddRange(fakeProfessionals);


        // ---------------------------------------------------------
        // 3. GERAR A GRADE DE DISPONIBILIDADE PADRÃO PARA CADA UM
        // ---------------------------------------------------------
        var availabilities = new List<Availability>();

        foreach (var professional in fakeProfessionals)
        {
            // Loop de Segunda (1 = Monday) a Sexta (5 = Friday)
            for (int day = 1; day <= 5; day++)
            {
                var currentDay = (DayOfWeek)day; // Conversão para a tipagem correta

                // Turno da Manhã (09:00 as 13:00)
                availabilities.Add(new Availability
                {
                    Id = Guid.NewGuid(),
                    ProfessionalId = professional.Id, // Vínculo com o profissional
                    DayOfWeek = currentDay,
                    StartTime = new TimeOnly(9, 0, 0),
                    EndTime = new TimeOnly(13, 0, 0)
                });

                // Turno da Tarde (15:00 as 19:00)
                availabilities.Add(new Availability
                {
                    Id = Guid.NewGuid(),
                    ProfessionalId = professional.Id, // Vínculo com o profissional
                    DayOfWeek = currentDay,
                    StartTime = new TimeOnly(15, 0, 0),
                    EndTime = new TimeOnly(19, 0, 0)
                });
            }
        }

        // Adiciona as disponibilidades (50 profissionais * 10 horários = 500 registros)
        db.Availabilities.AddRange(availabilities);

        // ---------------------------------------------------------
        // 4. GERAR OS SERVIÇOS PARA CADA PROFISSIONAL
        // ---------------------------------------------------------
        // Uma lista mista de possíveis serviços para o Bogus sortear
        var serviceNames = new[]
        {
            "Corte Completo", "Consultoria Especializada", "Sessão Padrão",
            "Manutenção", "Pacote Premium", "Atendimento VIP", "Sessão Express"
        };

        var services = new List<Service>();

        // Criamos as regras de como um serviço falso deve ser preenchido
        var serviceFaker = new Faker<Service>("pt_BR")
            .RuleFor(s => s.Id, f => Guid.NewGuid())
            .RuleFor(s => s.Name, f => f.PickRandom(serviceNames))
            // Preço aleatório entre R$ 50,00 e R$ 400,00
            .RuleFor(s => s.Price, f => Math.Round(f.Random.Decimal(50m, 400m), 2))
            // Duração sorteada: 30, 60, 90 ou 120 minutos
            .RuleFor(s => s.DurationMinutes, f => f.PickRandom(30, 60, 90, 120))
            // Uma breve descrição gerada dinamicamente
            .RuleFor(s => s.Description, f => f.Lorem.Sentence(6));

        foreach (var professional in fakeProfessionals)
        {
            // Sorteia para que alguns profissionais tenham 2 serviços, outros 3 ou 4
            int amountOfServices = new Random().Next(2, 5);

            // Gera os serviços aplicando o ID do profissional atual
            var fakeServices = serviceFaker.Clone()
                .RuleFor(s => s.ProfessionalId, _ => professional.Id)
                .Generate(amountOfServices);

            services.AddRange(fakeServices);
        }

        // Adiciona todos os serviços gerados ao contexto (serão entre 100 e 200 serviços no total)
        db.Services.AddRange(services);

        // ---------------------------------------------------------
        // 4. SALVAR TUDO
        // ---------------------------------------------------------
        db.SaveChanges(); // Salva Usuários, Profissionais e Disponibilidades numa tacada só!
    }
}