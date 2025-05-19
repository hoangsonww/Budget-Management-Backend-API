FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore BudgetManagement.API.csproj
RUN dotnet publish BudgetManagement.API.csproj -c Release -o /app
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 80
ENTRYPOINT ["dotnet","BudgetManagement.API.dll"]
