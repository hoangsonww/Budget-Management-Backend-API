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
