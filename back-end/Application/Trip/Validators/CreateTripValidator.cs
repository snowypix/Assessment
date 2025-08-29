using FluentValidation;
using backend.Application.Trips.Queries;
using backend.Application.Trips.Commands;

namespace backend.Application.Trips.Validators
{
    public class CreateTripValidator : AbstractValidator<CreateTripCommand>
    {
        public CreateTripValidator()
        {
            RuleFor(x => x.departureStationId)
    .GreaterThan(0).WithMessage("Departure station must be valid.")
    .NotEqual(x => x.arrivalStationId).WithMessage("Source and destination cannot be the same.");

            RuleFor(x => x.arrivalStationId)
                .GreaterThan(0).WithMessage("Arrival station must be valid.");
            RuleFor(x => x.departureDate)
.GreaterThan(_ => DateTime.UtcNow)
.WithMessage("Choose a newer date.");
        }
    }
}
