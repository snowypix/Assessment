using MediatR;
using backend.Domain.Models;
using back_end.Application.DTOs;

namespace backend.Application.Trips.Queries
{
    public record GetTripByIdQuery(int Id) : IRequest<Trip?>;
    public record GetAllTripsQuery() : IRequest<IEnumerable<Trip>>;
    public record CheckSchedulesQuery(
        int DepartureStationId,
        int ArrivalStationId,
        DateTime DepartureTime
    ) : IRequest<IEnumerable<TripScheduleDTO>>;
}
