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
