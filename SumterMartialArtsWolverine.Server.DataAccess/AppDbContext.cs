using Microsoft.EntityFrameworkCore;
using SumterMartialArtsWolverine.Server.Domain;
using SumterMartialArtsWolverine.Server.Domain.Common;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Domain.ValueObjects;
using Wolverine;

namespace SumterMartialArtsWolverine.Server.DataAccess;

public class AppDbContext : DbContext
{
    private readonly IMessageContext _messageContext;

    public AppDbContext(DbContextOptions<AppDbContext> options, IMessageContext messageContext)
        : base(options)
    {
        _messageContext = messageContext;
    }

    public DbSet<Program> Programs => Set<Program>();
    public DbSet<Instructor> Instructors => Set<Instructor>();
    public DbSet<PrivateLessonRequest> PrivateLessonRequests => Set<PrivateLessonRequest>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<StudentProgressionEvent> StudentProgressionEvents => Set<StudentProgressionEvent>();
    public DbSet<User> Users => Set<User>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<EmailTemplate> EmailTemplates => Set<EmailTemplate>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Ignore<RequestStatus>();
        modelBuilder.Ignore<LessonStatus>();
        modelBuilder.Ignore<AvailabilityRule>();

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entitiesWithEvents = ChangeTracker.Entries<Entity>()
            .Select(e => e.Entity)
            .Where(e => e.DomainEvents.Any())
            .ToList();

        var domainEvents = entitiesWithEvents
            .SelectMany(e => e.DomainEvents)
            .ToList();

        entitiesWithEvents.ForEach(e => e.ClearDomainEvents());

        var result = await base.SaveChangesAsync(cancellationToken);

        foreach (var domainEvent in domainEvents)
        {
            await _messageContext.PublishAsync(domainEvent);
        }

        return result;
    }
}