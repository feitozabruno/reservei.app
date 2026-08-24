# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Reservei.Api/*.csproj ./Reservei.Api/
RUN dotnet restore ./Reservei.Api/Reservei.Api.csproj

COPY . .
RUN dotnet publish Reservei.Api/Reservei.Api.csproj -c Release -o /app/publish

# Etapa 2: runtime (imagem final, bem mais leve)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Reservei.Api.dll"]