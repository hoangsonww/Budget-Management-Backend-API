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
