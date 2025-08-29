using FluentValidation;
using backend.Application.Trips.Queries;

namespace backend.Application.Trips.Validators
{
    public class CheckSchedulesQueryValidator : AbstractValidator<CheckSchedulesQuery>
    {
        public CheckSchedulesQueryValidator()
        {
            RuleFor(x => x.DepartureStationId)
                .GreaterThan(0).WithMessage("Departure station must be valid.")
                .NotEqual(x => x.ArrivalStationId).WithMessage("Source and destination cannot be the same.");

            RuleFor(x => x.ArrivalStationId)
                .GreaterThan(0).WithMessage("Arrival station must be valid.");
            RuleFor(x => x.DepartureTime)
     .GreaterThan(_ => DateTime.UtcNow)
     .WithMessage("Trip already started.");
        }
    }
}
