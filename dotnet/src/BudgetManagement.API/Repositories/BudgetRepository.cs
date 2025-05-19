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
