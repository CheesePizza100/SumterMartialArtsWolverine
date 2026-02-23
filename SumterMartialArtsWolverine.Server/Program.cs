using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using SumterMartialArtsAzure.Server.Api.Middleware;
using SumterMartialArtsWolverine.Server.Api;
using SumterMartialArtsWolverine.Server.Api.Auditing;
using SumterMartialArtsWolverine.Server.Api.EndpointConfigurations;
using SumterMartialArtsWolverine.Server.Api.Features.Admin.Queries.GetProgressionAnalytics.Calculators;
using SumterMartialArtsWolverine.Server.Api.Features.Auth.Commands.Login;
using SumterMartialArtsWolverine.Server.Api.Features.PrivateLessons.Queries.GetPrivateLessons.Filters;
using SumterMartialArtsWolverine.Server.Api.Middleware;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain;
using SumterMartialArtsWolverine.Server.Domain.Common;
using SumterMartialArtsWolverine.Server.Domain.Events;
using SumterMartialArtsWolverine.Server.Domain.Services;
using SumterMartialArtsWolverine.Server.Services;
using SumterMartialArtsWolverine.Server.Services.Email;
using SumterMartialArtsWolverine.Server.Services.Telemetry;
using SumterMartialArtsWolverine.Server.Services.Telemetry.Enrichers;
using System.Text;
using Wolverine;
using Wolverine.ErrorHandling;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentCreated>, StudentCreatedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentContactInfoUpdated>, StudentContactInfoUpdatedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentPromoted>, StudentPromotedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentWithdrewFromProgram>, StudentWithdrewFromProgramTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentTestRecorded>, StudentTestRecordedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentAttendanceRecorded>, StudentAttendanceRecordedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentEnrolledInProgram>, StudentEnrolledInProgramTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<InstructorLoginCreated>, InstructorLoginCreatedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<PrivateLessonRequestCreated>, PrivateLessonRequestCreatedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<PrivateLessonRequestApproved>, PrivateLessonRequestApprovedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<PrivateLessonRequestRejected>, PrivateLessonRequestRejectedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentDeactivated>, StudentDeactivatedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentReactivated>, StudentReactivatedTelemetryEnricher>();
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentLoginCreated>, StudentLoginCreatedTelemetryEnricher>();

builder.Host.UseWolverine(opts =>
{
    // Auto-discover handlers
    opts.Discovery.IncludeAssembly(typeof(Program).Assembly);
    opts.Discovery.IncludeAssembly(typeof(Student).Assembly);

    // Apply exception handling first (catches everything)
    //opts.Policies.AddMiddleware(typeof(ExceptionHandlingMiddleware));

    // Apply logging to everything
    opts.Policies.AddMiddleware(typeof(LoggingMiddleware));

    // Apply auditing only to auditable commands
    opts.Policies.ForMessagesOfType<IAuditableCommand>()
        .AddMiddleware(typeof(AuditingMiddleware));

    // Apply login auditing only to login commands
    opts.Policies.ForMessagesOfType<LoginCommand>()
        .AddMiddleware(typeof(LoginAuditingMiddleware));

    // Apply telemetry to domain events only
    opts.Policies.ForMessagesOfType<IDomainEvent>()
        .AddMiddleware(typeof(DomainEventTelemetryMiddleware));
});

// Enrichers still register as before
builder.Services.AddTransient<IDomainEventTelemetryEnricher<StudentCreated>, StudentCreatedTelemetryEnricher>();
// ... etc

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var emailSettings = builder.Configuration.GetSection("EmailSettings").Get<EmailSettings>()
                    ?? throw new InvalidOperationException("EmailSettings not configured");

builder.Services
    .AddFluentEmail(emailSettings.FromEmail, emailSettings.FromName)
    .AddSmtpSender(
        emailSettings.SmtpServer,
        emailSettings.SmtpPort
    );

builder.Services.AddScoped<ITokenGeneratorService, TokenGeneratorService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<EmailOrchestrator>();
builder.Services.AddScoped<EmailSender>();
builder.Services.AddScoped<EmailBodyParser>();
builder.Services.AddTransient<IEventProjector, EnrollmentEventProjector>();
builder.Services.AddTransient<IEventProjector, PromotionEventProjector>();
builder.Services.AddTransient<IEventProjector, TestAttemptEventProjector>();
builder.Services.AddTransient<IPrivateLessonFilter, PendingLessonsFilter>();
builder.Services.AddTransient<IPrivateLessonFilter, RecentLessonsFilter>();
builder.Services.AddTransient<IPrivateLessonFilter, AllLessonsFilter>();
builder.Services.AddTransient<IProgressionAnalyticsCalculator, EnrollmentCountCalculator>();
builder.Services.AddTransient<IProgressionAnalyticsCalculator, TestStatisticsCalculator>();
builder.Services.AddTransient<IProgressionAnalyticsCalculator, PromotionCountCalculator>();
builder.Services.AddTransient<IProgressionAnalyticsCalculator, MonthlyTestActivityCalculator>();
builder.Services.AddTransient<IProgressionAnalyticsCalculator, RankDistributionCalculator>();
builder.Services.AddTransient<IProgressionAnalyticsCalculator, AverageTimeToRankCalculator>();
builder.Services.AddTransient<IStudentProgressionEventService, StudentProgressionEventService>();
builder.Services.AddTransient<RankProgressionCalculator>();
builder.Services.AddTransient<TimeToPromotionCalculator>();

builder.Services.AddApplicationInsightsTelemetry(options =>
{
    options.ConnectionString = builder.Configuration["APPINSIGHTS_CONNECTIONSTRING"];
});
builder.Services.AddHealthChecks();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                    "https://localhost:62921",
                    "http://localhost:62921",
                    "https://gray-glacier-08d7e450f.1.azurestaticapps.net",
                    "https://*.azurestaticapps.net"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));

    options.AddPolicy("InstructorOrAdmin", policy =>
        policy.RequireRole("Instructor", "Admin"));

    options.AddPolicy("StudentOnly", policy =>
        policy.RequireRole("Student"));
});

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token"
    });

    //options.AddSecurityRequirement(new OpenApiSecurityRequirement
    //{
    //    {
    //        new OpenApiSecurityScheme
    //        {
    //            Reference = new OpenApiReference
    //            {
    //                Type = ReferenceType.SecurityScheme,
    //                Id = "Bearer"
    //            }
    //        },
    //        Array.Empty<string>()
    //    }
    //});
});

var app = builder.Build();
app.UseGlobalExceptionHandling();
app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbSeeder.Seed(db);
}
app.UseCors("AllowFrontend");

// since we're separating frontend and backend, we need to remove the frontend hosting from your API.
// the visual studio project type web api and angular hosts both together
//app.UseDefaultFiles();
//app.UseStaticFiles();
//app.MapFallbackToFile("/index.html");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapEndpoints();
app.MapHealthChecks("/health");

app.Run();

public class EmailSettings
{
    public string SmtpServer { get; set; } = string.Empty;
    public int SmtpPort { get; set; }
    public string SmtpUsername { get; set; } = string.Empty;
    public string SmtpPassword { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
    public bool EnableSsl { get; set; }
}