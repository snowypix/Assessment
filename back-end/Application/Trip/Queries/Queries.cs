using MediatR;
using backend.Domain.Models;

namespace backend.Application.Trips.Queries
{
    public record GetTripByIdQuery(int Id) : IRequest<Trip?>;
    public record GetAllTripsQuery() : IRequest<IEnumerable<Trip>>;
}
