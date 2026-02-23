using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain;
using SumterMartialArtsWolverine.Server.Services;

namespace SumterMartialArtsWolverine.Server.Api;

public static class UserSeeder
{
    public static void SeedAdminUser(AppDbContext context)
    {
        var passwordHasher = new BcryptPasswordHasher();
        var passwordHash = passwordHasher.Hash("Admin123!");
        var admin = User.CreateAdmin("admin", "admin@sumtermartialarts.com", passwordHash);

        context.Users.Add(admin);
        context.SaveChanges();

        Console.WriteLine("Seeded admin user - UserName: admin, Password: Admin123!");
    }
}