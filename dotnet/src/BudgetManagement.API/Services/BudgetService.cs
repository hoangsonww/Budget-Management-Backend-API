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
