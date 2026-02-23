using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain.Services;
using SumterMartialArtsWolverine.Server.Services;

namespace SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Login;

public class LoginCommandHandler
{
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenGeneratorService _tokenGeneratorService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AppDbContext _dbContext;

    public LoginCommandHandler(IPasswordHasher passwordHasher, ITokenGeneratorService tokenGeneratorService, IHttpContextAccessor httpContextAccessor, AppDbContext dbContext)
    {
        _passwordHasher = passwordHasher;
        _tokenGeneratorService = tokenGeneratorService;
        _httpContextAccessor = httpContextAccessor;
        _dbContext = dbContext;
    }

    public async Task<LoginCommandResponse> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Username == command.Username && u.IsActive);

        if (user == null || !user.VerifyPassword(command.Password, _passwordHasher))
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        user.UpdateLastLogin();
        await _dbContext.SaveChangesAsync();

        var token = _tokenGeneratorService.GenerateToken(user);

        return new LoginCommandResponse(
            token,
            user.Username,
            user.Id,
            user.Role.ToString(),
            user.MustChangePassword
        );
    }
}