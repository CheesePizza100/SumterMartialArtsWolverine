using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Services;
using SumterMartialArtsWolverine.Server.Services;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.ChangePassword;

public class ChangePasswordHandler
{
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPasswordHasher _passwordHasher;

    public ChangePasswordHandler(AppDbContext dbContext, ICurrentUserService currentUserService, IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _passwordHasher = passwordHasher;
    }

    public async Task<ChangePasswordCommandResponse> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetUserId();

        if (userId == null)
            throw new UnauthorizedAccessException("User not authenticated");

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
            throw new InvalidOperationException("User not found");

        if (!user.VerifyPassword(request.CurrentPassword, _passwordHasher))
            throw new InvalidOperationException("Current password is incorrect");

        // Validate new password (add your own validation rules)
        if (request.NewPassword.Length < 8)
            throw new InvalidOperationException("New password must be at least 8 characters");

        var newPasswordHash = _passwordHasher.Hash(request.NewPassword);
        user.ChangePassword(newPasswordHash);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ChangePasswordCommandResponse(
            true,
            "Password changed successfully",
            user.Id.ToString()
        );
    }
}