namespace SumterMartialArtsWolverine.Server.Api.Features.Instructors.Queries.GetInstructorAvailability;

public record GetInstructorAvailabilityResponse(List<AvailableSlotDto> AvailableSlots);

public record AvailableSlotDto(DateTime Start, DateTime End, int DurationMinutes);