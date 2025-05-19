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
