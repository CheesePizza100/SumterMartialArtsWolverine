using SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.ChangePassword;
using SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Login;
using SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Logout;

namespace SumterMartialArtsWolverine.Server.Api.EndpointConfigurations;

public static class AuthEndpoints
{
    public static void Map(RouteGroupBuilder api)
    {
        // Auth - Public
        var auth = api.MapGroup("/auth");
        LoginEndpoint.MapEndpoint(auth);
        LogoutEndpoint.MapEndpoint(auth);

        // Auth - Authenticated Only
        var authProtected = api.MapGroup("/auth")
            .RequireAuthorization();
        ChangePasswordEndpoint.MapEndpoint(authProtected);
    }
}