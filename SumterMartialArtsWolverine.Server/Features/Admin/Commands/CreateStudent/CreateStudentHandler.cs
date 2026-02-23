using SumterMartialArtsWolverine.Server.Api.Features.Students.Queries.GetStudentById;
using SumterMartialArtsWolverine.Server.Api.Features.Students.Shared;
using SumterMartialArtsWolverine.Server.DataAccess;
using SumterMartialArtsWolverine.Server.Domain;

namespace SumterMartialArtsWolverine.Server.Api.Features.Admin.Commands.CreateStudent;

public class CreateStudentHandler 
{
    private readonly AppDbContext _dbContext;

    public CreateStudentHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetStudentByIdResponse> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
    {
        var student = Student.Create(
            name: request.Name,
            email: request.Email,
            phone: request.Phone
        );

        _dbContext.Students.Add(student);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new GetStudentByIdResponse(
            student.Id,
            student.Name,
            student.Email,
            student.Phone,
            new List<ProgramEnrollmentDto>(),
            new List<TestHistoryDto>()
        );
    }
}