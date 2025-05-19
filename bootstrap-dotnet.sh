#!/usr/bin/env bash
set -e

# 1. Make dotnet folder and subfolders
mkdir -p dotnet/src/BudgetManagement.API/{Data,Models,Repositories,Services,Controllers}

# 2. csproj (with pack metadata)
cat > dotnet/BudgetManagement.API.csproj << 'EOF'
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <Authors>Son Nguyen</Authors>
    <PackageId>BudgetManagement.API</PackageId>
    <Version>1.0.0</Version>
    <Description>Comprehensive .NET 7 Budget Management Backend API</Description>
    <PackageTags>budget;management;api;dotnet;ef-core</PackageTags>
    <RepositoryUrl>https://github.com/hoangsonww/Budget-Management-Backend-API</RepositoryUrl>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="7.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="7.0.0">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
  </ItemGroup>
</Project>
EOF

# 3. Program.cs
cat > dotnet/src/BudgetManagement.API/Program.cs << 'EOF'
using BudgetManagement.API.Data;
using BudgetManagement.API.Repositories;
using BudgetManagement.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// EF Core (DefaultConnection from settings or env)
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI
builder.Services.AddScoped<IBudgetRepository, BudgetRepository>();
builder.Services.AddScoped<IBudgetService, BudgetService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
EOF

# 4. AppDbContext
cat > dotnet/src/BudgetManagement.API/Data/AppDbContext.cs << 'EOF'
using Microsoft.EntityFrameworkCore;
using BudgetManagement.API.Models;

namespace BudgetManagement.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }
        public DbSet<User> Users => Set<User>();
        public DbSet<Budget> Budgets => Set<Budget>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Transaction> Transactions => Set<Transaction>();
    }
}
EOF

# 5. Models
cat > dotnet/src/BudgetManagement.API/Models/User.cs << 'EOF'
namespace BudgetManagement.API.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = default!;
        public string Email    { get; set; } = default!;
        public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    }
}
EOF

cat > dotnet/src/BudgetManagement.API/Models/Budget.cs << 'EOF'
namespace BudgetManagement.API.Models
{
    public class Budget
    {
        public Guid Id             { get; set; }
        public string Name         { get; set; } = default!;
        public decimal TotalAmount { get; set; }
        public Guid UserId         { get; set; }
        public User? User          { get; set; }
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
EOF

cat > dotnet/src/BudgetManagement.API/Models/Category.cs << 'EOF'
namespace BudgetManagement.API.Models
{
    public class Category
    {
        public Guid Id       { get; set; }
        public string Name   { get; set; } = default!;
        public Guid BudgetId { get; set; }
        public Budget? Budget { get; set; }
    }
}
EOF

cat > dotnet/src/BudgetManagement.API/Models/Transaction.cs << 'EOF'
namespace BudgetManagement.API.Models
{
    public class Transaction
    {
        public Guid Id          { get; set; }
        public decimal Amount   { get; set; }
        public DateTime Date    { get; set; }
        public string Description { get; set; } = default!;
        public Guid CategoryId  { get; set; }
        public Category? Category { get; set; }
    }
}
EOF

# 6. Repository + Service
cat > dotnet/src/BudgetManagement.API/Repositories/IBudgetRepository.cs << 'EOF'
using BudgetManagement.API.Models;

namespace BudgetManagement.API.Repositories
{
    public interface IBudgetRepository
    {
        Task<IEnumerable<Budget>> GetAllAsync(Guid userId);
        Task<Budget?> GetByIdAsync(Guid id);
        Task AddAsync(Budget budget);
        Task UpdateAsync(Budget budget);
        Task DeleteAsync(Guid id);
    }
}
EOF

cat > dotnet/src/BudgetManagement.API/Repositories/BudgetRepository.cs << 'EOF'
using Microsoft.EntityFrameworkCore;
using BudgetManagement.API.Data;
using BudgetManagement.API.Models;

namespace BudgetManagement.API.Repositories
{
    public class BudgetRepository : IBudgetRepository
    {
        private readonly AppDbContext _db;
        public BudgetRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Budget>> GetAllAsync(Guid userId) =>
            await _db.Budgets.Where(b => b.UserId == userId).ToListAsync();

        public async Task<Budget?> GetByIdAsync(Guid id) =>
            await _db.Budgets.FindAsync(id);

        public async Task AddAsync(Budget budget)
        {
            _db.Budgets.Add(budget);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Budget budget)
        {
            _db.Budgets.Update(budget);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var b = await _db.Budgets.FindAsync(id);
            if (b is not null) { _db.Budgets.Remove(b); await _db.SaveChangesAsync(); }
        }
    }
}
EOF

cat > dotnet/src/BudgetManagement.API/Services/IBudgetService.cs << 'EOF'
using BudgetManagement.API.Models;

namespace BudgetManagement.API.Services
{
    public interface IBudgetService
    {
        Task<IEnumerable<Budget>> GetBudgetsAsync(Guid userId);
        Task<Budget?> GetBudgetAsync(Guid id);
        Task<Budget> CreateBudgetAsync(Budget budget);
        Task UpdateBudgetAsync(Budget budget);
        Task DeleteBudgetAsync(Guid id);
    }
}
EOF

cat > dotnet/src/BudgetManagement.API/Services/BudgetService.cs << 'EOF'
using BudgetManagement.API.Models;
using BudgetManagement.API.Repositories;

namespace BudgetManagement.API.Services
{
    public class BudgetService : IBudgetService
    {
        private readonly IBudgetRepository _repo;
        public BudgetService(IBudgetRepository repo) => _repo = repo;

        public Task<IEnumerable<Budget>> GetBudgetsAsync(Guid userId) => _repo.GetAllAsync(userId);
        public Task<Budget?> GetBudgetAsync(Guid id)     => _repo.GetByIdAsync(id);

        public async Task<Budget> CreateBudgetAsync(Budget budget)
        {
            budget.Id = Guid.NewGuid();
            await _repo.AddAsync(budget);
            return budget;
        }

        public Task UpdateBudgetAsync(Budget budget) => _repo.UpdateAsync(budget);
        public Task DeleteBudgetAsync(Guid id)        => _repo.DeleteAsync(id);
    }
}
EOF

# 7. Controller
cat > dotnet/src/BudgetManagement.API/Controllers/BudgetsController.cs << 'EOF'
using Microsoft.AspNetCore.Mvc;
using BudgetManagement.API.Models;
using BudgetManagement.API.Services;

namespace BudgetManagement.API.Controllers
{
    [ApiController]
    [Route("api/users/{userId}/[controller]")]
    public class BudgetsController : ControllerBase
    {
        private readonly IBudgetService _svc;
        public BudgetsController(IBudgetService svc) => _svc = svc;

        [HttpGet]            public async Task<IActionResult> GetAll(Guid userId) => Ok(await _svc.GetBudgetsAsync(userId));
        [HttpGet("{id}")]    public async Task<IActionResult> Get(Guid userId, Guid id) => (await _svc.GetBudgetAsync(id)) is Budget b ? Ok(b) : NotFound();
        [HttpPost]           public async Task<IActionResult> Create(Guid userId, Budget budget){ budget.UserId=userId; var c=await _svc.CreateBudgetAsync(budget); return CreatedAtAction(nameof(Get), new{userId,id=c.Id},c); }
        [HttpPut("{id}")]    public async Task<IActionResult> Update(Guid userId, Guid id, Budget budget){ budget.Id=id; budget.UserId=userId; await _svc.UpdateBudgetAsync(budget); return NoContent(); }
        [HttpDelete("{id}")] public async Task<IActionResult> Delete(Guid userId, Guid id){ await _svc.DeleteBudgetAsync(id); return NoContent(); }
    }
}
EOF

# 8. Dockerfile
cat > dotnet/src/BudgetManagement.API/Dockerfile << 'EOF'
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
EOF

# 9. nuget.config
cat > dotnet/nuget.config << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="github" value="https://nuget.pkg.github.com/hoangsonww/index.json" />
  </packageSources>
  <packageSourceCredentials>
    <github>
      <add key="Username" value="hoangsonww" />
      <add key="ClearTextPassword" value="${GH_TOKEN}" />
    </github>
  </packageSourceCredentials>
</configuration>
EOF

# 10. GitHub Actions workflow
mkdir -p dotnet/.github/workflows
cat > dotnet/.github/workflows/publish.yml << 'EOF'
name: Build & Publish to GitHub Packages

on:
  push:
    branches: [ main ]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '7.0.x'

      - name: Restore & Build
        run: |
          cd src/BudgetManagement.API
          dotnet restore
          dotnet build --configuration Release

      - name: Pack
        run: |
          cd src/BudgetManagement.API
          dotnet pack --configuration Release --no-build --output ../../artifacts

      - name: Push to GitHub Packages
        run: |
          dotnet nuget push artifacts/*.nupkg \
            --source github \
            --api-key ${{ secrets.GITHUB_TOKEN }}
EOF

echo "✅ Done! Everything is under ./dotnet.  GitHub Actions will build & publish your NuGet package for you."
