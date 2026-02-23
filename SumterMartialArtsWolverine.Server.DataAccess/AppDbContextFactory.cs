using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.DataAccess;

public class AppDbContextFactory
    : IDesignTimeDbContextFactory<AppDbContext>
{
    private readonly IMessageContext _messageContext;

    public AppDbContextFactory(IMessageContext messageContext)
    {
        _messageContext = messageContext;
    }

    public AppDbContextFactory()
    {
    }

    public AppDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

        // Use connection string from appsettings.json
        optionsBuilder.UseSqlServer(
            configuration.GetConnectionString("DefaultConnection"));
        return new AppDbContext(optionsBuilder.Options, _messageContext);
    }
}